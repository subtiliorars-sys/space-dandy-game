/** Pause overlay copy — keyboard + touch resume hints. */
export function formatPauseOverlayText(muted: boolean): string {
  const mute = muted ? "muted" : "on";
  return `PAUSED\n← → move · C CRT · M ${mute}\nEsc or tap to resume`;
}
