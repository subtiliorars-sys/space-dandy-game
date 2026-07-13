import Phaser from "phaser";
import { CrtOverlay } from "../render/crtOverlay.js";
import {
  drawGrooveOrb,
  drawHazard,
  drawNeonShip,
  drawSpaceGrid,
} from "../render/shapes.js";
import { getGrooveAudio } from "../audio/grooveAudio.js";
import {
  createSurgeState,
  effectiveHazardChance,
  surgeOrbMultiplier,
  tickSurge,
  tierForScore,
  type SurgeState,
} from "../sim/difficulty.js";
import { formatMuteHudLabel } from "../ui/muteHudLabel.js";
import { hudPadding, readSafeInsetsFromDocument } from "../ui/touchLayout.js";
import { orbPoints, readHighScoreFromStorage, recordRun, writeHighScoreToStorage } from "../sim/score.js";
import type { RunStats } from "../sim/types.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

type Collectible = {
  kind: "orb" | "hazard";
  x: number;
  y: number;
  gfx: Phaser.GameObjects.Graphics;
  spin: number;
};

export class PlayScene extends Phaser.Scene {
  private grid!: Phaser.GameObjects.Graphics;
  private shipGfx!: Phaser.GameObjects.Graphics;
  private crt!: CrtOverlay;
  private hudScore!: Phaser.GameObjects.Text;
  private hudCombo!: Phaser.GameObjects.Text;
  private hudLives!: Phaser.GameObjects.Text;
  private hudCrt!: Phaser.GameObjects.Text;
  private hudMute!: Phaser.GameObjects.Text;
  private hudSurge!: Phaser.GameObjects.Text;

  private scroll = 0;
  private shipX = GAME_WIDTH / 2;
  private speed = 320;
  private spawnMs = 900;
  private elapsed = 0;
  private lives = 3;
  private combo = 0;
  private score = 0;
  private orbsCollected = 0;
  private hazardsHit = 0;
  private items: Collectible[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: { a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key; c: Phaser.Input.Keyboard.Key };
  private audio = getGrooveAudio();
  private touchMove = 0;
  private pad = hudPadding(readSafeInsetsFromDocument());
  private surge: SurgeState = createSurgeState();
  private paused = false;
  private pauseOverlay!: Phaser.GameObjects.Text;

  constructor() {
    super("PlayScene");
  }

  create(): void {
    this.grid = this.add.graphics();
    this.shipGfx = this.add.graphics();
    this.crt = new CrtOverlay(this, GAME_WIDTH, GAME_HEIGHT);
    this.add.existing(this.crt);

    this.hudScore = this.add
      .text(this.pad.x, this.pad.yTop, "", { fontFamily: "monospace", fontSize: "18px", color: "#ffe566" })
      .setScrollFactor(0)
      .setDepth(900);
    this.hudCombo = this.add
      .text(this.pad.x, this.pad.yTop + 24, "", { fontFamily: "monospace", fontSize: "16px", color: "#3ef0ff" })
      .setScrollFactor(0)
      .setDepth(900);
    this.hudLives = this.add
      .text(GAME_WIDTH - this.pad.x, this.pad.yTop, "", { fontFamily: "monospace", fontSize: "18px", color: "#ff3eb5" })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(900);
    this.hudCrt = this.add
      .text(GAME_WIDTH - this.pad.x, GAME_HEIGHT - this.pad.yBottom, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#9a8ab8",
      })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(900);
    this.hudMute = this.add
      .text(this.pad.x, GAME_HEIGHT - this.pad.yBottom, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#9a8ab8",
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(900);
    this.hudSurge = this.add
      .text(GAME_WIDTH / 2, this.pad.yTop, "", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffe566",
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(900);

    this.createTouchLanes();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = {
      a: this.input.keyboard!.addKey("A"),
      d: this.input.keyboard!.addKey("D"),
      c: this.input.keyboard!.addKey("C"),
    };
    this.input.keyboard!.on("keydown-C", () => {
      this.crt.toggle();
      this.refreshHud();
    });
    this.input.keyboard!.on("keydown-M", () => {
      this.audio.toggleMute();
      this.refreshHud();
    });
    this.input.keyboard!.on("keydown-ESC", () => this.togglePause());

    this.pauseOverlay = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "",
        {
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#f4eaff",
          align: "center",
          backgroundColor: "#000000aa",
          padding: { x: 16, y: 12 },
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false);

    this.audio.ensureStarted();
    this.audio.startGroove();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.audio.stopGroove();
    });

    this.scale.on("resize", () => this.crt.redraw());
    this.refreshHud();
    drawNeonShip(this.shipGfx, this.shipX, GAME_HEIGHT - 70);
  }

  update(_time: number, delta: number): void {
    if (this.paused) return;
    const dt = delta / 1000;
    this.scroll += delta * 0.08;
    drawSpaceGrid(this.grid, GAME_WIDTH, GAME_HEIGHT, this.scroll);

    const wasSurging = this.surge.active;
    this.surge = tickSurge(this.surge, delta, this.score);
    if (this.surge.active && !wasSurging) {
      this.audio.playCollect();
    }

    let move = 0;
    if (this.cursors.left?.isDown || this.keys.a.isDown) move -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) move += 1;
    if (this.touchMove !== 0) move = this.touchMove;
    this.shipX = Phaser.Math.Clamp(this.shipX + move * this.speed * dt, 40, GAME_WIDTH - 40);
    drawNeonShip(this.shipGfx, this.shipX, GAME_HEIGHT - 70);

    const tier = tierForScore(this.score);
    const baseSpawn = 900 * tier.spawnScale;
    this.elapsed += delta;
    if (this.elapsed >= Math.max(380, this.spawnMs)) {
      this.elapsed = 0;
      this.spawnMs = Phaser.Math.Clamp(baseSpawn - 4, 380, 900);
      this.spawnItem();
    }

    for (const item of this.items) {
      item.y += 180 * dt;
      item.spin += dt * 2;
      if (item.kind === "orb") {
        drawGrooveOrb(item.gfx, item.x, item.y, item.spin * 3);
      } else {
        drawHazard(item.gfx, item.x, item.y, item.spin);
      }

      if (Phaser.Math.Distance.Between(item.x, item.y, this.shipX, GAME_HEIGHT - 70) < 28) {
        if (item.kind === "orb") {
          this.combo += 1;
          this.orbsCollected += 1;
          this.score += orbPoints(this.combo) * surgeOrbMultiplier(this.surge.active);
          this.audio.playCollect();

          if (typeof localStorage !== "undefined") {
            const savedFuel = localStorage.getItem("warp-patrol-crossover-fuel");
            let currentFuel = savedFuel ? parseInt(savedFuel, 10) || 0 : 0;
            currentFuel = Math.min(100, currentFuel + 10);
            localStorage.setItem("warp-patrol-crossover-fuel", currentFuel.toString());
          }
        } else {
          this.combo = 0;
          this.hazardsHit += 1;
          this.lives -= 1;
          this.audio.playHazard();
          this.cameras.main.shake(120, 0.008);
        }
        item.gfx.destroy();
        item.y = 9999;
        this.refreshHud();
        if (this.lives <= 0) {
          this.endRun();
          return;
        }
      }
    }

    this.items = this.items.filter((item) => {
      if (item.y > GAME_HEIGHT + 40) {
        if (item.kind === "orb") this.combo = 0;
        item.gfx.destroy();
        return false;
      }
      return true;
    });
    this.refreshHud();
  }

  private createTouchLanes(): void {
    const btnW = 110;
    const btnH = 88;
    const y = GAME_HEIGHT - this.pad.yBottom - btnH - 28;
    const leftX = this.pad.x;
    const rightX = GAME_WIDTH - this.pad.x - btnW;

    const makeLane = (x: number, label: string, dir: -1 | 1) => {
      const zone = this.add
        .rectangle(x, y, btnW, btnH, 0x3ef0ff, 0.12)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x3ef0ff, 0.55)
        .setScrollFactor(0)
        .setDepth(950)
        .setInteractive({ useHandCursor: true });
      this.add
        .text(x + btnW / 2, y + btnH / 2, label, {
          fontFamily: "monospace",
          fontSize: "28px",
          color: "#f4eaff",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(951);

      zone.on("pointerdown", () => {
        this.touchMove = dir;
        this.audio.ensureStarted();
      });
      zone.on("pointerup", () => {
        if (this.touchMove === dir) this.touchMove = 0;
      });
      zone.on("pointerout", () => {
        if (this.touchMove === dir) this.touchMove = 0;
      });
    };

    makeLane(leftX, "◀", -1);
    makeLane(rightX, "▶", 1);
  }

  private spawnItem(): void {
    const tier = tierForScore(this.score);
    const hazardChance = effectiveHazardChance(tier, this.surge.active);
    const kind: Collectible["kind"] = Math.random() < 1 - hazardChance ? "orb" : "hazard";
    const gfx = this.add.graphics();
    const item: Collectible = {
      kind,
      x: Phaser.Math.Between(48, GAME_WIDTH - 48),
      y: -24,
      gfx,
      spin: Math.random() * Math.PI,
    };
    this.items.push(item);
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) this.refreshPauseOverlay();
    this.pauseOverlay.setVisible(this.paused);
  }

  private refreshPauseOverlay(): void {
    const mute = this.audio.isMuted() ? "muted" : "on";
    this.pauseOverlay.setText(`PAUSED\n← → move · C CRT · M ${mute}\nEsc resume`);
  }

  private refreshHud(): void {
    this.hudScore.setText(`Score ${this.score}`);
    this.hudCombo.setText(this.combo > 1 ? `Combo x${this.combo}` : "");
    this.hudLives.setText(`♥ ${this.lives}`);
    this.hudCrt.setText(`CRT ${this.crt.enabled ? "ON" : "OFF"}`);
    this.hudMute.setText(formatMuteHudLabel(this.audio.isMuted(), true));
    this.hudSurge.setText(this.surge.active ? "GROOVE SURGE ×2" : "");
    if (this.paused) this.refreshPauseOverlay();
  }

  private endRun(): void {
    this.audio.stopGroove();
    const stats: RunStats = {
      score: this.score,
      combo: this.combo,
      orbsCollected: this.orbsCollected,
      hazardsHit: this.hazardsHit,
    };
    const prev = readHighScoreFromStorage((k) => localStorage.getItem(k));
    writeHighScoreToStorage((k, v) => localStorage.setItem(k, v), recordRun(prev, this.score));
    this.items.forEach((i) => i.gfx.destroy());
    this.items = [];
    this.scene.start("GameOverScene", stats);
  }
}
