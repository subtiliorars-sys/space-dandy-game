import { describe, expect, it } from "vitest";
import { loadHighScore, orbPoints, recordRun } from "./score.js";

describe("orbPoints", () => {
  it("starts at 10 and scales with combo", () => {
    expect(orbPoints(1)).toBe(10);
    expect(orbPoints(2)).toBe(15);
    expect(orbPoints(5)).toBe(30);
  });
});

describe("high score persistence", () => {
  it("loads empty storage safely", () => {
    expect(loadHighScore(null)).toEqual({ best: 0, runs: 0 });
    expect(loadHighScore("{bad json")).toEqual({ best: 0, runs: 0 });
  });

  it("records best score and run count", () => {
    const first = recordRun({ best: 100, runs: 2 }, 80);
    expect(first).toEqual({ best: 100, runs: 3 });
    const second = recordRun(first, 240);
    expect(second).toEqual({ best: 240, runs: 4 });
  });
});
