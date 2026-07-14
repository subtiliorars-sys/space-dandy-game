import Phaser from "phaser";
import { getGrooveAudio } from "../audio/grooveAudio.js";
import { drawSpaceGrid } from "../render/shapes.js";
import type { RunStats } from "../sim/types.js";
import { formatDisplayScore, readHighScoreFromStorage } from "../sim/score.js";
import { gameOverTapTarget } from "../ui/gameOverTapTarget.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

export class GameOverScene extends Phaser.Scene {
  private grid!: Phaser.GameObjects.Graphics;
  private scroll = 0;

  constructor() {
    super("GameOverScene");
  }

  create(data: RunStats): void {
    this.grid = this.add.graphics();
    getGrooveAudio().stopGroove();
    const high = readHighScoreFromStorage((k) => localStorage.getItem(k));
    const isRecord = data.score >= high.best && data.score > 0;

    this.add
      .text(GAME_WIDTH / 2, 100, "PATROL OVER", {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#ff3eb5",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        190,
        `Score: ${formatDisplayScore(data.score)}\nOrbs: ${data.orbsCollected}  ·  Hits: ${data.hazardsHit}\nBest: ${formatDisplayScore(high.best)}${isRecord ? "  NEW!" : ""}`,
        {
          fontFamily: "monospace",
          fontSize: "20px",
          color: "#f4eaff",
          align: "center",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 80,
        "SPACE / tap left — title   ·   R / tap right — retry",
        {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#9a8ab8",
        },
      )
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start("TitleScene"));
    this.input.keyboard?.once("keydown-R", () => this.scene.start("PlayScene"));
    this.input.once("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const target = gameOverTapTarget(pointer.x, GAME_WIDTH);
      this.scene.start(target === "title" ? "TitleScene" : "PlayScene");
    });
  }

  update(_time: number, delta: number): void {
    this.scroll += delta * 0.05;
    drawSpaceGrid(this.grid, GAME_WIDTH, GAME_HEIGHT, this.scroll);
  }
}
