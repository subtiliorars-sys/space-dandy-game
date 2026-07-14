import { describe, expect, it } from "vitest";
import { formatPauseOverlayText } from "./pauseOverlayText.js";

describe("formatPauseOverlayText", () => {
  it("mentions tap resume for touch players", () => {
    expect(formatPauseOverlayText(false)).toContain("tap to resume");
    expect(formatPauseOverlayText(true)).toContain("M muted");
  });
});
