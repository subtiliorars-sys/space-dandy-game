# Space Dandy: Groove Patrol

Neon space arcade mini-game â€” Phaser 3 + TypeScript. Collect groove orbs, dodge hazards, chase combos. CRT scanline toggle included.

**Play (GitHub Pages):** https://subtiliorars-sys.github.io/space-dandy-game/  
**Playtest hub:** https://subtiliorars-sys.github.io/space-dandy-game/playtest.html  
**Repo:** https://github.com/subtiliorars-sys/space-dandy-game

> Fan homage with original characters and mechanics â€” **not** affiliated with official *Space Dandy* IP.

## First session

See `docs/FIRST-SESSION.md` for first-run expectations.

## Commands

```powershell
npm install
npm run dev       # local play
npm run verify    # tsc + vitest + build + HTML check
npm run package:itch   # zip for itch.io HTML upload
```

## Controls

| Input | Action |
|-------|--------|
| ← → / A D / on-screen ◀ ▶ | Move ship |
| C | Toggle CRT scanlines |
| M | Mute / unmute (persists) |
| SPACE | Start / return to title |
| R | Quick retry after game over |

## Desktop builds

```powershell
npm run desktop:install
npm run desktop:start   # build + Electron window
npm run desktop:pack    # unsigned Windows package â†’ dist-electron/
```

## Public launch

- **GitHub Pages** deploys on every push to `main` (see `.github/workflows/deploy-pages.yml`).
- **itch.io** copy-paste kit: `docs/ITCH_PASTE_READY.md`
- **Playtest feedback:** GitHub Issues with label `playtest`

## Waves

Autonomous worker reads `WAVES.md` â€” one wave = one PR, branch prefix `automation/wave-*`.

## Ethics

No dark patterns, no loot boxes, no FOMO timers. See `GOVERNANCE.md`.


