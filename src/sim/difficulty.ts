/** Score-tier difficulty + groove-surge windows (pure, testable). */

export type DifficultyTier = {
  /** Inclusive score floor for this tier. */
  minScore: number;
  /** Probability an item is a hazard (rest are orbs). */
  hazardChance: number;
  /** Spawn interval scale (1 = baseline). */
  spawnScale: number;
};

export const DIFFICULTY_TIERS: DifficultyTier[] = [
  { minScore: 0, hazardChance: 0.22, spawnScale: 1 },
  { minScore: 150, hazardChance: 0.3, spawnScale: 0.92 },
  { minScore: 400, hazardChance: 0.38, spawnScale: 0.84 },
  { minScore: 800, hazardChance: 0.46, spawnScale: 0.76 },
  { minScore: 1400, hazardChance: 0.52, spawnScale: 0.7 },
];

export function tierForScore(score: number): DifficultyTier {
  let current = DIFFICULTY_TIERS[0]!;
  for (const tier of DIFFICULTY_TIERS) {
    if (score >= tier.minScore) current = tier;
  }
  return current;
}

export type SurgeState = {
  active: boolean;
  remainingMs: number;
  cooldownMs: number;
};

export const SURGE_DURATION_MS = 2800;
export const SURGE_COOLDOWN_MS = 12000;
export const SURGE_SCORE_GATE = 80;

export function createSurgeState(): SurgeState {
  return { active: false, remainingMs: 0, cooldownMs: SURGE_COOLDOWN_MS };
}

/** Advance surge timers; may start a surge when cooldown elapsed and score gate met. */
export function tickSurge(
  state: SurgeState,
  deltaMs: number,
  score: number,
  roll: () => number = Math.random,
): SurgeState {
  let { active, remainingMs, cooldownMs } = state;
  if (active) {
    remainingMs -= deltaMs;
    if (remainingMs <= 0) {
      active = false;
      remainingMs = 0;
      cooldownMs = SURGE_COOLDOWN_MS;
    }
    return { active, remainingMs, cooldownMs };
  }

  cooldownMs = Math.max(0, cooldownMs - deltaMs);
  if (cooldownMs === 0 && score >= SURGE_SCORE_GATE && roll() < 0.012) {
    return { active: true, remainingMs: SURGE_DURATION_MS, cooldownMs: 0 };
  }
  return { active, remainingMs, cooldownMs };
}

/** During surge, hazards are rarer and orbs score with a multiplier. */
export function effectiveHazardChance(tier: DifficultyTier, surgeActive: boolean): number {
  if (!surgeActive) return tier.hazardChance;
  return Math.max(0.08, tier.hazardChance * 0.35);
}

export function surgeOrbMultiplier(surgeActive: boolean): number {
  return surgeActive ? 2 : 1;
}
