/**
 * Mute HUD copy — avoids "Mute ON" (reads like sound is enabled).
 * @param compact When true, hide the label while audio is on (play HUD).
 */
export function formatMuteHudLabel(muted: boolean, compact = false): string {
  if (compact && !muted) return "";
  return muted ? "Audio muted (M)" : "Audio on (M)";
}
