import { describe, expect, it } from "vitest";
import { formatMuteHudLabel } from "./muteHudLabel.js";

describe("formatMuteHudLabel", () => {
  it("uses clear audio state wording", () => {
    expect(formatMuteHudLabel(true)).toBe("Audio muted (M)");
    expect(formatMuteHudLabel(false)).toBe("Audio on (M)");
  });

  it("hides label in compact mode when audio is on", () => {
    expect(formatMuteHudLabel(false, true)).toBe("");
    expect(formatMuteHudLabel(true, true)).toBe("Audio muted (M)");
  });
});
