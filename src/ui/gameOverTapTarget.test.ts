import { describe, expect, it } from "vitest";
import { gameOverTapTarget } from "./gameOverTapTarget.js";

describe("gameOverTapTarget", () => {
  it("maps left half to title and right half to retry", () => {
    expect(gameOverTapTarget(0, 800)).toBe("title");
    expect(gameOverTapTarget(399, 800)).toBe("title");
    expect(gameOverTapTarget(400, 800)).toBe("retry");
    expect(gameOverTapTarget(799, 800)).toBe("retry");
  });

  it("defaults to retry when viewport width is invalid", () => {
    expect(gameOverTapTarget(10, 0)).toBe("retry");
  });
});
