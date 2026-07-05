# Public launch checklist — Space Dandy: Groove Patrol

**Date:** 2026-06-24

## Live surfaces

| Surface | Status | URL |
|---------|--------|-----|
| GitHub repo | bootstrap | https://github.com/subtiliorars-sys/space-dandy-game |
| GitHub Pages (game) | deploy on push | https://subtiliorars-sys.github.io/space-dandy-game/ |
| GitHub Pages (playtest) | deploy on push | https://subtiliorars-sys.github.io/space-dandy-game/playtest.html |
| itch.io | owner upload | see `ITCH_PASTE_READY.md` |

## Owner one-time (itch)

1. Log in to https://itch.io/dashboard
2. **Create new project** → paste fields from `ITCH_PASTE_READY.md`
3. Upload zip from `npm run package:itch`
4. Upload `docs/itch-cover.png` as cover
5. Publish (visibility: public)

## Fleet worker unblock

After repo exists, `corps-fleet-doctor.ps1` should report `space-dandy-game` GitHub **match** instead of UNREACHABLE.

## Next waves (automation)

- SD-W2 audio juice
- SD-W3 mobile touch
- SD-W5 itch screenshots + butler automation
