# CLAUDE.md — Space Dandy Game

Phaser 3 + Vite + TypeScript browser arcade. Fleet game repo.

## Verify

```powershell
npm run verify
```

## Architecture

- `src/scenes/` — Boot, Title, Play, GameOver
- `src/render/` — neon grid drawing, CRT overlay
- `src/sim/score.ts` — combo math + localStorage high score

## Worker rules

- Read `WAVES.md` before coding
- Branch `automation/wave-*` only (auto-merge eligible)
- UI-facing waves: add playtest steps in PR body
- No official Space Dandy IP assets — original fan homage only

## Deploy

- GitHub Pages base: `/space-dandy-game/` via `CORPS_PAGES_BASE`
- itch.io zip: `npm run package:itch`
