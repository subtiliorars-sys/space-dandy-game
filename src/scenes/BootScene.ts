import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#070010");
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "GROOVE PATROL", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#3ef0ff",
      })
      .setOrigin(0.5);
    this.time.delayedCall(400, () => this.scene.start("TitleScene"));
  }
}
