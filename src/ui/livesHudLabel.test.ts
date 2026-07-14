import { describe, expect, it } from "vitest";
import { formatLivesHudLabel } from "./livesHudLabel.js";

describe("formatLivesHudLabel", () => {
  it("repeats heart glyphs for each life", () => {
    expect(formatLivesHudLabel(3)).toBe("♥♥♥");
    expect(formatLivesHudLabel(1)).toBe("♥");
  });

  it("returns empty when out of lives", () => {
    expect(formatLivesHudLabel(0)).toBe("");
    expect(formatLivesHudLabel(-1)).toBe("");
  });

  it("floors fractional values", () => {
    expect(formatLivesHudLabel(2.9)).toBe("♥♥");
  });
});
