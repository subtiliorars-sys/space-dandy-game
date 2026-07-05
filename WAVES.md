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
**Status:** `pending`  
- [ ] Collect / hazard SFX stubs (Web Audio, mute toggle)
- [ ] Background groove loop (royalty-free or procedural stub)

### Wave SD-W3 — Mobile touch lanes
**Status:** `pending`  
- [ ] On-screen move buttons for portrait phones
- [ ] Safe-area padding on HUD

### Wave SD-W4 — Wave difficulty curve
**Status:** `pending`  
- [ ] Hazard ratio scales with score tiers
- [ ] Brief "groove surge" bonus windows

### Wave SD-W5 — itch.io polish pass
**Status:** `pending`  
- [ ] Cover image 630×500
- [ ] Screenshot set for store page
- [ ] Butler push script (owner `BUTLER_API_KEY`)

### Wave SD-W6 — Warp Patrol crossover (shared ship fuel)
**Status:** `pending`  
- [ ] Read shared lore: `agent-corps/concepts/WARP_PATROL_SHARED.md`
- [ ] Groove coins contribute to crossover fuel key (when WM-W3 lands)
- [ ] Title screen nod to Warp Division / destination ???

## Blocked (owner)

- Official Space Dandy licensed assets / voice lines
- Paid store pricing changes without owner sign-off

## Completed

- **SD-W1** — initial public slice (repo bootstrap + Pages + playtest.html)
