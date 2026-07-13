import { describe, expect, it } from "vitest";
import {
  createSurgeState,
  effectiveHazardChance,
  surgeOrbMultiplier,
  tickSurge,
  tierForScore,
} from "./difficulty.js";

describe("tierForScore", () => {
  it("escalates hazard chance by score", () => {
    expect(tierForScore(0).hazardChance).toBe(0.22);
    expect(tierForScore(150).hazardChance).toBe(0.3);
    expect(tierForScore(900).hazardChance).toBe(0.46);
    expect(tierForScore(2000).spawnScale).toBe(0.7);
  });
});

describe("groove surge", () => {
  it("doubles orb value while active", () => {
    expect(surgeOrbMultiplier(true)).toBe(2);
    expect(surgeOrbMultiplier(false)).toBe(1);
  });

  it("reduces hazard chance during surge", () => {
    const tier = tierForScore(400);
    expect(effectiveHazardChance(tier, true)).toBeLessThan(tier.hazardChance);
  });

  it("can start after cooldown when score gate met", () => {
    const ready = { ...createSurgeState(), cooldownMs: 0 };
    const next = tickSurge(ready, 16, 100, () => 0);
    expect(next.active).toBe(true);
    expect(next.remainingMs).toBeGreaterThan(0);
  });

  it("does not start below score gate", () => {
    const ready = { ...createSurgeState(), cooldownMs: 0 };
    const next = tickSurge(ready, 16, 10, () => 0);
    expect(next.active).toBe(false);
  });
});
