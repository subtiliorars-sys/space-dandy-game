import { describe, expect, it } from "vitest";
import {
  shouldAutoPauseOnTabHide,
  shouldAutoResumeOnTabShow,
  shouldBlockResumeWhileHidden,
} from "./tabVisibility.js";

describe("tab visibility pause", () => {
  it("auto-pauses only when hidden and not already paused", () => {
    expect(shouldAutoPauseOnTabHide(true, false)).toBe(true);
    expect(shouldAutoPauseOnTabHide(true, true)).toBe(false);
    expect(shouldAutoPauseOnTabHide(false, false)).toBe(false);
  });

  it("auto-resumes only after a tab-hide pause", () => {
    expect(shouldAutoResumeOnTabShow(false, true)).toBe(true);
    expect(shouldAutoResumeOnTabShow(false, false)).toBe(false);
    expect(shouldAutoResumeOnTabShow(true, true)).toBe(false);
  });

  it("blocks resume while the tab stays hidden", () => {
    expect(shouldBlockResumeWhileHidden(true)).toBe(true);
    expect(shouldBlockResumeWhileHidden(false)).toBe(false);
  });
});
