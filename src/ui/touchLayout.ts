/** Portrait-friendly touch + safe-area helpers (no DOM required for unit tests). */

export type SafeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function parseCssPx(raw: string | null | undefined): number {
  if (!raw) return 0;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/** Clamp HUD margins so text clears notches / home indicators. */
export function hudPadding(insets: SafeInsets, base = 16): { x: number; yTop: number; yBottom: number } {
  return {
    x: base + Math.max(insets.left, insets.right),
    yTop: base + insets.top,
    yBottom: base + insets.bottom,
  };
}

export function readSafeInsetsFromCss(
  getProp: (name: string) => string,
): SafeInsets {
  return {
    top: parseCssPx(getProp("--sat")),
    right: parseCssPx(getProp("--sar")),
    bottom: parseCssPx(getProp("--sab")),
    left: parseCssPx(getProp("--sal")),
  };
}

export function readSafeInsetsFromDocument(
  doc: Document | null | undefined = typeof document !== "undefined" ? document : null,
): SafeInsets {
  if (!doc?.documentElement) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  const style = getComputedStyle(doc.documentElement);
  return readSafeInsetsFromCss((name) => style.getPropertyValue(name));
}
