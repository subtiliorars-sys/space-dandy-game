/** Auto-pause when the player switches browser tabs mid-run. */
export function shouldAutoPauseOnTabHide(documentHidden: boolean, paused: boolean): boolean {
  return documentHidden && !paused;
}

export function shouldAutoResumeOnTabShow(documentHidden: boolean, tabAutoPaused: boolean): boolean {
  return !documentHidden && tabAutoPaused;
}

export function shouldBlockResumeWhileHidden(documentHidden: boolean): boolean {
  return documentHidden;
}
