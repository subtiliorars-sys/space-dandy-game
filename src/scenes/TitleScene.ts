import Phaser from "phaser";
import { getGrooveAudio } from "../audio/grooveAudio.js";
import { drawSpaceGrid } from "../render/shapes.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";
import { readHighScoreFromStorage } from "../sim/score.js";

export class TitleScene extends Phaser.Scene {
  private grid!: Phaser.GameObjects.Graphics;
  private scroll = 0;
  private muteHud!: Phaser.GameObjects.Text;
  private audio = getGrooveAudio();

  constructor() {
    super("TitleScene");
  }

  create(): void {
    this.grid = this.add.graphics();
    const high = readHighScoreFromStorage((k) => localStorage.getItem(k));

    this.add
      .text(GAME_WIDTH / 2, 120, "SPACE DANDY", {
        fontFamily: "monospace",
        fontSize: "42px",
        color: "#ff3eb5",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 175, "GROOVE PATROL", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#3ef0ff",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 260, "Collect groove orbs. Dodge hazards.\nPress SPACE or tap to start.", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#f4eaff",
        align: "center",
      })
      .setOrigin(0.5);

    const savedFuel = typeof localStorage !== "undefined" ? localStorage.getItem("warp-patrol-crossover-fuel") : null;
    const crossoverFuel = savedFuel ? parseInt(savedFuel, 10) || 0 : 0;
    const lastDest = typeof localStorage !== "undefined" ? localStorage.getItem("warp-patrol-destination") : null;

    let crossoverText = `Warp Division Fuel: ${crossoverFuel}%`;
    if (crossoverFuel >= 75) {
      crossoverText = "Warp Division Status: READY FOR LAUNCH!";
      if (lastDest) {
        crossoverText = `Launched to ${lastDest}!`;
      }
    }

    this.add
      .text(GAME_WIDTH / 2, 316, crossoverText, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffd93d",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 360, `High score: ${high.best}  ·  Runs: ${high.runs}`, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#9a8ab8",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 48, "← → move  ·  C CRT  ·  M mute  ·  fan homage — not official IP", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#7b6a99",
      })
      .setOrigin(0.5);

    this.muteHud = this.add
      .text(16, GAME_HEIGHT - 16, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#9a8ab8",
      })
      .setOrigin(0, 1);
    this.refreshMuteHud();

    this.input.keyboard?.on("keydown-M", () => {
      this.audio.toggleMute();
      this.refreshMuteHud();
    });
    this.input.keyboard?.once("keydown-SPACE", () => this.startPatrol());
    this.input.once("pointerdown", () => this.startPatrol());
  }

  private refreshMuteHud(): void {
    this.muteHud.setText(`Mute ${this.audio.isMuted() ? "ON" : "OFF"} (M)`);
  }

  update(_time: number, delta: number): void {
    this.scroll += delta * 0.04;
    drawSpaceGrid(this.grid, GAME_WIDTH, GAME_HEIGHT, this.scroll);
  }

  private startPatrol(): void {
    this.audio.ensureStarted();
    this.scene.start("PlayScene");
  }
}
