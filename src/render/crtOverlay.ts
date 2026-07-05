import Phaser from "phaser";
import { CRT_STORAGE_KEY } from "../sim/types.js";

export class CrtOverlay extends Phaser.GameObjects.Container {
  private scanlines: Phaser.GameObjects.Graphics;
  private vignette: Phaser.GameObjects.Graphics;
  enabled = true;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    super(scene, 0, 0);
    this.scanlines = scene.add.graphics();
    this.vignette = scene.add.graphics();
    this.add([this.scanlines, this.vignette]);
    this.setScrollFactor(0);
    this.setDepth(1000);
    this.resize(width, height);
    this.loadPreference();
  }

  loadPreference(): void {
    try {
      const raw = localStorage.getItem(CRT_STORAGE_KEY);
      if (raw === "0") this.enabled = false;
    } catch {
      /* ignore */
    }
    this.redraw();
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem(CRT_STORAGE_KEY, this.enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
    this.redraw();
    return this.enabled;
  }

  resize(width: number, height: number): void {
    this.scanlines.clear();
    this.vignette.clear();

    if (this.enabled) {
      this.scanlines.fillStyle(0x000000, 0.12);
      for (let y = 0; y < height; y += 3) {
        this.scanlines.fillRect(0, y, width, 1);
      }
      this.vignette.fillStyle(0x000000, 0.35);
      this.vignette.fillRect(0, 0, width, height * 0.08);
      this.vignette.fillRect(0, height * 0.92, width, height * 0.08);
    }
  }

  redraw(): void {
    const { width, height } = this.scene.scale;
    this.resize(width, height);
  }
}
