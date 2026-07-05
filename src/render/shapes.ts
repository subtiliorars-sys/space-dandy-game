import Phaser from "phaser";

const NEON = {
  pink: 0xff3eb5,
  cyan: 0x3ef0ff,
  yellow: 0xffe566,
  purple: 0x7b2cff,
  grid: 0x2a1050,
};

export function drawSpaceGrid(
  g: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  scrollY: number,
): void {
  g.clear();
  g.fillStyle(0x070010, 1);
  g.fillRect(0, 0, width, height);

  const spacing = 48;
  const offset = scrollY % spacing;

  g.lineStyle(1, NEON.grid, 0.55);
  for (let x = 0; x <= width; x += spacing) {
    g.lineBetween(x, 0, x, height);
  }
  for (let y = -spacing + offset; y <= height + spacing; y += spacing) {
    g.lineBetween(0, y, width, y);
  }

  g.lineStyle(2, NEON.purple, 0.35);
  g.strokeRect(8, 8, width - 16, height - 16);
}

export function drawNeonShip(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
): void {
  g.clear();
  g.fillStyle(NEON.cyan, 0.25);
  g.fillCircle(x, y, 22);
  g.fillStyle(NEON.pink, 1);
  g.fillTriangle(x, y - 18, x - 16, y + 14, x + 16, y + 14);
  g.lineStyle(2, NEON.yellow, 0.9);
  g.strokeTriangle(x, y - 18, x - 16, y + 14, x + 16, y + 14);
}

export function drawGrooveOrb(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  pulse: number,
): void {
  const r = 12 + Math.sin(pulse) * 2;
  g.clear();
  g.fillStyle(NEON.cyan, 0.2);
  g.fillCircle(x, y, r + 6);
  g.fillStyle(NEON.cyan, 1);
  g.fillCircle(x, y, r);
  g.lineStyle(2, 0xffffff, 0.6);
  g.strokeCircle(x, y, r);
}

export function drawHazard(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  rotation: number,
): void {
  g.clear();
  g.fillStyle(NEON.pink, 0.15);
  g.fillCircle(x, y, 20);
  g.fillStyle(NEON.pink, 1);
  const points: Phaser.Geom.Point[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = rotation + (i * Math.PI * 2) / 5 - Math.PI / 2;
    points.push(new Phaser.Geom.Point(x + Math.cos(angle) * 14, y + Math.sin(angle) * 14));
  }
  g.fillPoints(points, true);
}

export { NEON };
