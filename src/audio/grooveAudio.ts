/** Procedural Web Audio stubs — no licensed assets (GOVERNANCE.md). */

export const MUTE_STORAGE_KEY = "space-dandy-mute-v1";

export function loadMuted(raw: string | null): boolean {
  return raw === "1" || raw === "true";
}

export function readMutedFromStorage(getItem: (key: string) => string | null): boolean {
  return loadMuted(getItem(MUTE_STORAGE_KEY));
}

export function writeMutedToStorage(
  setItem: (key: string, value: string) => void,
  muted: boolean,
): void {
  setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
}

type ToneSpec = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

function beep(
  ctx: AudioContext,
  dest: GainNode,
  { freq, duration, type = "square", gain = 0.08 }: ToneSpec,
  when = 0,
): void {
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Collect orb: short ascending chirp. */
export function scheduleCollectTone(ctx: AudioContext, dest: GainNode): void {
  beep(ctx, dest, { freq: 520, duration: 0.06, type: "triangle", gain: 0.07 }, 0);
  beep(ctx, dest, { freq: 780, duration: 0.08, type: "triangle", gain: 0.06 }, 0.05);
}

/** Hazard hit: descending buzz. */
export function scheduleHazardTone(ctx: AudioContext, dest: GainNode): void {
  beep(ctx, dest, { freq: 180, duration: 0.12, type: "sawtooth", gain: 0.09 }, 0);
  beep(ctx, dest, { freq: 110, duration: 0.16, type: "sawtooth", gain: 0.07 }, 0.08);
}

/** One bar of a simple groove pulse (procedural stub). */
export function scheduleGrooveBar(ctx: AudioContext, dest: GainNode): void {
  const pulse: ToneSpec[] = [
    { freq: 98, duration: 0.08, type: "triangle", gain: 0.04 },
    { freq: 130, duration: 0.06, type: "sine", gain: 0.03 },
    { freq: 98, duration: 0.08, type: "triangle", gain: 0.035 },
    { freq: 196, duration: 0.05, type: "sine", gain: 0.025 },
  ];
  const steps = [0, 0.25, 0.5, 0.75];
  pulse.forEach((spec, i) => beep(ctx, dest, spec, steps[i]!));
}

export class GrooveAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted: boolean;
  private grooveTimer: ReturnType<typeof setInterval> | null = null;
  private grooveOn = false;

  constructor(
    private readonly storage: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
    } = typeof localStorage !== "undefined"
      ? localStorage
      : { getItem: () => null, setItem: () => undefined },
  ) {
    this.muted = readMutedFromStorage((k) => this.storage.getItem(k));
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Unlock AudioContext on a user gesture if needed. */
  ensureStarted(): void {
    if (typeof AudioContext === "undefined" && typeof (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext === "undefined") {
      return;
    }
    const AC =
      globalThis.AudioContext ??
      (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    writeMutedToStorage((k, v) => this.storage.setItem(k, v), muted);
    if (this.master) {
      this.master.gain.value = muted ? 0 : 1;
    }
    if (muted) {
      this.stopGroove();
    } else if (this.grooveOn) {
      this.startGroove();
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playCollect(): void {
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    scheduleCollectTone(this.ctx, this.master);
  }

  playHazard(): void {
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    scheduleHazardTone(this.ctx, this.master);
  }

  startGroove(): void {
    this.grooveOn = true;
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    if (this.grooveTimer) return;
    scheduleGrooveBar(this.ctx, this.master);
    this.grooveTimer = setInterval(() => {
      if (!this.ctx || !this.master || this.muted) return;
      scheduleGrooveBar(this.ctx, this.master);
    }, 1000);
  }

  stopGroove(): void {
    this.grooveOn = false;
    if (this.grooveTimer) {
      clearInterval(this.grooveTimer);
      this.grooveTimer = null;
    }
  }
}

/** Shared singleton for scenes (browser only). */
let shared: GrooveAudio | null = null;

export function getGrooveAudio(): GrooveAudio {
  if (!shared) shared = new GrooveAudio();
  return shared;
}
