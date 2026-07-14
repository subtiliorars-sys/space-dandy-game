/** Lives HUD — repeated heart glyphs instead of a numeric suffix. */
export function formatLivesHudLabel(lives: number): string {
  const n = Math.max(0, Math.floor(lives));
  if (n === 0) return "";
  return "♥".repeat(n);
}
