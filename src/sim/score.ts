import type { PersistedHighScore } from "./types.js";
import { STORAGE_KEY } from "./types.js";

export function orbPoints(combo: number): number {
  const chain = Math.max(1, combo);
  return 10 + (chain - 1) * 5;
}

/** Thousands-separated score for HUD and game-over screens. */
export function formatDisplayScore(score: number): string {
  if (!Number.isFinite(score) || score < 0) return "0";
  return Math.floor(score).toLocaleString("en-US");
}

export function loadHighScore(raw: string | null): PersistedHighScore {
  if (!raw) return { best: 0, runs: 0 };
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedHighScore>;
    return {
      best: typeof parsed.best === "number" ? parsed.best : 0,
      runs: typeof parsed.runs === "number" ? parsed.runs : 0,
    };
  } catch {
    return { best: 0, runs: 0 };
  }
}

export function recordRun(
  previous: PersistedHighScore,
  score: number,
): PersistedHighScore {
  return {
    best: Math.max(previous.best, score),
    runs: previous.runs + 1,
  };
}

export function readHighScoreFromStorage(
  getItem: (key: string) => string | null,
): PersistedHighScore {
  return loadHighScore(getItem(STORAGE_KEY));
}

export function writeHighScoreToStorage(
  setItem: (key: string, value: string) => void,
  data: PersistedHighScore,
): void {
  setItem(STORAGE_KEY, JSON.stringify(data));
}
