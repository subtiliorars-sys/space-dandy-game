import { describe, expect, it } from "vitest";
import { hudPadding, parseCssPx, readSafeInsetsFromCss } from "./touchLayout.js";

describe("parseCssPx", () => {
  it("parses env-like values", () => {
    expect(parseCssPx("12px")).toBe(12);
    expect(parseCssPx("0")).toBe(0);
    expect(parseCssPx("")).toBe(0);
    expect(parseCssPx(undefined)).toBe(0);
  });
});

describe("hudPadding", () => {
  it("adds insets to base margins", () => {
    expect(hudPadding({ top: 20, right: 0, bottom: 34, left: 8 }, 16)).toEqual({
      x: 24,
      yTop: 36,
      yBottom: 50,
    });
  });
});

describe("readSafeInsetsFromCss", () => {
  it("reads custom properties", () => {
    const map: Record<string, string> = {
      "--sat": "44px",
      "--sar": "0px",
      "--sab": "21px",
      "--sal": "0px",
    };
    expect(readSafeInsetsFromCss((n) => map[n] ?? "")).toEqual({
      top: 44,
      right: 0,
      bottom: 21,
      left: 0,
    });
  });
});
