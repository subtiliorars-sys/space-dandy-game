# itch.io — Space Dandy: Groove Patrol (copy-paste ready)

*Owner action: create itch project and upload zip (or run butler when `BUTLER_API_KEY` is set).*

---

## Project settings

| Field | Value |
|-------|-------|
| **Title** | Space Dandy: Groove Patrol |
| **URL slug** | `jimmythehat-space-dandy-groove-patrol` |
| **Full URL** | https://subtiliorars.itch.io/jimmythehat-space-dandy-groove-patrol |
| **Developer name** | JimmyTheHat |
| **Kind** | HTML |
| **Main file** | `index.html` |
| **Viewport** | **800 × 600** |
| **Price** | **Free** (early access playtest) or PWYW $0+ |
| **Tags** | arcade, browser, neon, retro, sci-fi, singleplayer, short, casual |

---

## Short description

> Neon space patrol mini-arcade. Collect groove orbs, dodge hazards, chain combos. CRT toggle included. Browser play — no install.

---

## Full description

```
SPACE DANDY: GROOVE PATROL · EARLY ACCESS · JIMMYTHEHAT

A funky neon space patrol arcade homage. Pilot the groove ship across a scrolling
space grid, collect cyan orbs, dodge pink hazards, and chase high scores.

WHAT YOU GET NOW (v0.1)
• Title → patrol → game over loop in the browser
• Combo scoring + local high score
• CRT scanline toggle (press C)
• Responsive canvas scaling
• Playtest hub with feedback link

EARLY ACCESS NOTE
Fan homage with original art/mechanics — not affiliated with official Space Dandy IP.
Audio, mobile controls, and difficulty waves ship via WAVES.md.

Also in the JimmyTheHat fleet: Yes Man, Men Eat Peanut Butter, Driving Me Nuts.
```

---

## Package & upload

```powershell
cd C:\Users\hrmread\space-dandy-game
.\scripts\package-itchio.ps1
```

Upload `release/space-dandy-game-browser-v0.1.0.zip` → **Uploads** → check **This file will be played in the browser**.

Cover art: `docs/itch-cover.png` (630×500 recommended).

### Butler (optional)

```powershell
# Install: https://itch.io/docs/butler/
$env:BUTLER_API_KEY = "<from itch.io user API keys>"
butler push release/space-dandy-game-browser-v0.1.0.zip subtiliorars/jimmythehat-space-dandy-groove-patrol:html
butler status subtiliorars/jimmythehat-space-dandy-groove-patrol:html
```

---

## After publish

1. Set **Classification** → unrestricted / general audience
2. Enable **Embed** on external sites
3. Link GitHub Pages URL in **External links**
4. Add screenshot from playtest hub or in-game capture
