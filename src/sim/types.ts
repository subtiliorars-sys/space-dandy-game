export type RunStats = {
  score: number;
  combo: number;
  orbsCollected: number;
  hazardsHit: number;
};

export type PersistedHighScore = {
  best: number;
  runs: number;
};

export const STORAGE_KEY = "space-dandy-groove-patrol-v1";

export const CRT_STORAGE_KEY = "space-dandy-crt-enabled";
