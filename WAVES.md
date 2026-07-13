# Space Dandy Game — Wave Registry

One wave = one PR. Branch prefix: `automation/wave-*`. Verify: `npm run verify`.

## Pickup rules

1. Open automation PR exists → stop (wave in flight).
2. Else → first `pending`/`active` non-`blocked` wave below.
3. Never merge your own PR.

## Active queue

### Wave SD-W1 — Neon patrol vertical slice
**Status:** `done` (2026-06-24)  
**Shipped:** title → patrol → game over loop, CRT toggle, high score, playtest hub, Pages + itch kit

### Wave SD-W2 — Audio juice
**Status:** `done` (2026-07-13)  
**Shipped:** Web Audio collect/hazard stubs, M mute (localStorage), procedural groove loop during patrol; `@types/node` for verify

### Wave SD-W3 — Mobile touch lanes
**Status:** `done` (2026-07-13)  
**Shipped:** on-screen ◀ ▶ hold lanes; safe-area CSS + HUD padding helpers

### Wave SD-W4 — Wave difficulty curve
**Status:** `done` (2026-07-13)  
**Shipped:** score-tier hazard/spawn curve + brief GROOVE SURGE ×2 windows

### Wave SD-W5 — itch.io polish pass
**Status:** `done` (2026-07-13)  
- [x] Cover image 630×500 (`docs/cover.jpg`)
- [x] Screenshot set for store page (`docs/screenshot.jpg`)
- [x] Butler push script (owner `BUTLER_API_KEY`) (`scripts/deploy-itchio.ps1`)

### Wave SD-W6 — Warp Patrol crossover (shared ship fuel)
**Status:** `done` (2026-07-13)  
- [x] Read shared lore: `agent-corps/concepts/WARP_PATROL_SHARED.md` (not found/needed)
- [x] Groove coins contribute to crossover fuel key (when WM-W3 lands)
- [x] Title screen nod to Warp Division / destination ???

## Blocked (owner)

- Official Space Dandy licensed assets / voice lines
- Paid store pricing changes without owner sign-off

## Completed

- **SD-W6** — Warp Patrol crossover fuel sync
- **SD-W5** — itch.io polish pass (artwork assets + butler deploy script)
- **SD-W4** — difficulty tiers + groove surge windows
- **SD-W3** — mobile touch lanes + safe-area HUD
- **SD-W2** — audio juice (Web Audio stubs + mute + groove loop)
- **SD-W1** — initial public slice (repo bootstrap + Pages + playtest.html)
