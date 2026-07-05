import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";
import { TitleScene } from "./scenes/TitleScene.js";
import { PlayScene } from "./scenes/PlayScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export function createGame(parent: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#070010",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    scene: [BootScene, TitleScene, PlayScene, GameOverScene],
  });
}
