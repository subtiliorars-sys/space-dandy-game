import Phaser from "phaser";
import { CrtOverlay } from "../render/crtOverlay.js";
import {
  drawGrooveOrb,
  drawHazard,
  drawNeonShip,
  drawSpaceGrid,
} from "../render/shapes.js";
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

  constructor() {
    super("PlayScene");
  }

  create(): void {
    this.grid = this.add.graphics();
    this.shipGfx = this.add.graphics();
    this.crt = new CrtOverlay(this, GAME_WIDTH, GAME_HEIGHT);
    this.add.existing(this.crt);

    this.hudScore = this.add.text(16, 12, "", { fontFamily: "monospace", fontSize: "18px", color: "#ffe566" }).setScrollFactor(0).setDepth(900);
    this.hudCombo = this.add.text(16, 36, "", { fontFamily: "monospace", fontSize: "16px", color: "#3ef0ff" }).setScrollFactor(0).setDepth(900);
    this.hudLives = this.add.text(GAME_WIDTH - 16, 12, "", { fontFamily: "monospace", fontSize: "18px", color: "#ff3eb5" }).setOrigin(1, 0).setScrollFactor(0).setDepth(900);
    this.hudCrt = this.add.text(GAME_WIDTH - 16, GAME_HEIGHT - 16, "", { fontFamily: "monospace", fontSize: "14px", color: "#9a8ab8" }).setOrigin(1, 1).setScrollFactor(0).setDepth(900);

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

    this.scale.on("resize", () => this.crt.redraw());
    this.refreshHud();
    drawNeonShip(this.shipGfx, this.shipX, GAME_HEIGHT - 70);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.scroll += delta * 0.08;
    drawSpaceGrid(this.grid, GAME_WIDTH, GAME_HEIGHT, this.scroll);

    let move = 0;
    if (this.cursors.left?.isDown || this.keys.a.isDown) move -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) move += 1;
    this.shipX = Phaser.Math.Clamp(this.shipX + move * this.speed * dt, 40, GAME_WIDTH - 40);
    drawNeonShip(this.shipGfx, this.shipX, GAME_HEIGHT - 70);

    this.elapsed += delta;
    if (this.elapsed >= this.spawnMs) {
      this.elapsed = 0;
      this.spawnMs = Phaser.Math.Clamp(this.spawnMs - 4, 450, 900);
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
          this.score += orbPoints(this.combo);
        } else {
          this.combo = 0;
          this.hazardsHit += 1;
          this.lives -= 1;
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

  private spawnItem(): void {
    const kind: Collectible["kind"] = Math.random() < 0.72 ? "orb" : "hazard";
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

  private refreshHud(): void {
    this.hudScore.setText(`Score ${this.score}`);
    this.hudCombo.setText(this.combo > 1 ? `Combo x${this.combo}` : "");
    this.hudLives.setText(`♥ ${this.lives}`);
    this.hudCrt.setText(`CRT ${this.crt.enabled ? "ON" : "OFF"}`);
  }

  private endRun(): void {
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
