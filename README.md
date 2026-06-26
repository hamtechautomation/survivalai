# The Last Light Survival Guide
**Complete Offline Preparedness Knowledge Base — v1.0.0**

A comprehensive, dependency-free survival reference built for the grid-down scenario. Zero internet required after download. Works from a USB drive, laptop, tablet, or phone. No accounts, no tracking, no ads.

---

## Quick Start

1. **Copy this folder** to a USB drive or local directory
2. **Open `index.html`** in any modern web browser
3. **Bookmark it** — Ctrl+D / Cmd+D

> **Do this now:** Print `quick-reference.html` and `cards.html` before an emergency. Laminate the wallet cards.

---

## Setting Up Bunker Bot (Offline AI Assistant)

Bunker Bot connects to [Ollama](https://ollama.ai) running on your local machine. It is completely optional — the guide is fully usable without it. When Ollama is running, click the **Bunker Bot** button on any page to open the chat panel.

Bunker Bot features:
- Model selector (switch between installed models)
- Temperature slider (focused ↔ creative)
- Token counter
- Emergency mode (direct, step-by-step answers with no hedging)
- Copy last response / Export full chat
- Streaming responses with stop button

### macOS / Linux

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (phi3:mini fits in 4 GB RAM)
ollama pull phi3:mini

# Start with CORS open (required when opening from file://)
OLLAMA_ORIGINS=* ollama serve
```

To run Ollama automatically on login (macOS), add to `~/.zshrc`:
```bash
export OLLAMA_ORIGINS='*'
```
Then reload: `source ~/.zshrc`

For Linux systemd, edit the service:
```bash
sudo systemctl edit ollama.service --force
```
Add:
```ini
[Service]
Environment="OLLAMA_ORIGINS=*"
```
```bash
sudo systemctl daemon-reload && sudo systemctl restart ollama
```

### Windows 10 / 11

1. Download the Ollama installer from [ollama.ai](https://ollama.ai)
2. Run the installer (adds Ollama to system tray)
3. Open PowerShell:
```powershell
$env:OLLAMA_ORIGINS = "*"
ollama pull phi3:mini
ollama serve
```

To set `OLLAMA_ORIGINS` permanently: System Properties → Environment Variables → New User Variable → `OLLAMA_ORIGINS` = `*`

### USB / Air-Gapped Machine

1. On a connected machine: `ollama pull llama3:8b` (downloads to `~/.ollama/models/`)
2. Copy the entire `~/.ollama` folder to USB
3. On the air-gapped machine: install Ollama, copy the `~/.ollama` folder back
4. Run `OLLAMA_ORIGINS=* ollama serve` — models load from the copied folder

### Recommended Models by Hardware

| Model | RAM needed | Speed | Quality | Notes |
|-------|-----------|-------|---------|-------|
| `phi3:mini` | 4 GB | Fast | Good | Best for constrained hardware |
| `gemma3:4b` | 6 GB | Fast | Good | Excellent instruction following |
| `llama3:8b` | 8 GB | Medium | Very good | Best balance of speed/quality |
| `mistral:7b` | 8 GB | Medium | Very good | Strong at structured output |
| `llama3:70b` | 48 GB+ | Slow | Excellent | Needs a workstation |

---

## Content Overview

### 24 Content Sections

| Section | Key Topics |
|---------|-----------|
| Food & Water | Purification, preservation, foraging, sanitation |
| Medical & First Aid | Trauma, wound care, medication reference, improvised splints |
| Energy | Solar sizing, battery banks, hand tools, fuel storage |
| Shelter & Construction | Expedient shelter, insulation, earthworks, roofing |
| Communications | Ham radio, Morse code, signal mirrors, frequency reference |
| Navigation & Maps | Celestial navigation, star charts, map reading, dead reckoning |
| Security & Defense | Physical hardening, bug-out decision tree, threat assessment |
| Knowledge & Literacy | Education continuity, skill transfer, library curation |
| Agriculture | Seed saving, planting calendars, soil health, crop rotation |
| Animal Husbandry | Chickens, goats, rabbits, bees, veterinary basics |
| NBC / EMP Threats | Radiation exposure limits, decontamination, Faraday cages |
| Disaster Playbooks | Hurricane, earthquake, wildfire, pandemic, nuclear event |
| Climate & Regional | Zone-by-zone survival, UK foraging calendar, wild edibles |
| Metallurgy | JABOD forge, blacksmithing, smelting, nail making |
| Governance | Community organization, conflict resolution, resource allocation |
| Psychology & Morale | Stress management, group dynamics, box breathing, grief |
| Chemistry & Materials | Soap making, bleach production, fermentation chemistry |
| Textiles & Clothing | Spinning, weaving, leather tanning, pattern cutting |
| Vehicles & Transport | Fuel stabilization, EMP hardening, bicycle maintenance |
| Power Generation | Pedal generators, water wheels, wind, biogas, steam |
| Building & Structures | Cob, earthbag, timber frame, defences, site selection |
| Medicine Making | Tinctures, ORS, antiseptics, medicinal plants |
| Water Systems | Rainwater harvesting, wells, gravity distribution, irrigation |
| Practical Skills | 35 step-through visual skill guides across 7 categories |

### Practical Skills Section

`skills.html` provides interactive step-by-step guides for hands-on survival skills. Each skill includes:

- Guided step-through mode with keyboard navigation (← →)
- Inline SVG diagrams for key techniques
- Built-in countdown timers for timed steps
- CPR metronome (110 bpm, auto-pauses at 30 for breaths)
- Practice session logging and competency rating (None → Getting There → Competent → Can Teach)
- Instructor notes with common mistakes and fast-track tips
- Printable step cards

**Skill categories:** Fire (9) · Knots (11) · Navigation (5) · First Aid (4) · Hunting & Fishing (4) · Plant ID (3) · Construction (3)

Progress is stored locally via `localStorage` and can be exported/imported as JSON for backup or sharing across devices.

### Interactive Tools (all offline, no server required)

| Tool | Function |
|------|---------|
| Calorie Calculator | BMR + activity-level daily calorie target |
| Water Budget | Per-person daily water by climate and activity |
| Solar Sizing | Panel wattage, battery amp-hours, days of autonomy |
| Supply Tracker | Days-remaining calculator with red/amber/green status |
| Skill Inventory | Track and score your group's competencies |
| Planting Calendar | USDA zone-aware planting and harvest dates |
| Bug-Out Decision Tree | Structured stay/go decision with route assessment |
| Radio Frequency Reference | Pre-loaded emergency frequencies by type |
| Medication Reference | Dosing and storage guide for common emergency meds |

### Other Pages

- **`quick-reference.html`** — 2-page printable emergency card covering the first 72 hours
- **`cards.html`** — 12 wallet-sized lamination cards (water purification, Morse, wound care, etc.)
- **`gear.html`** — Interactive gear checklist with localStorage persistence
- **`ai-setup.html`** — Step-by-step Bunker Bot / Ollama setup with troubleshooting

---

## File Structure

```
last-light-survival-guide/
├── index.html                  ← Dashboard — start here
├── skills.html                 ← Practical Skills — 35 interactive guides
├── quick-reference.html        ← 72-hour emergency card (print first)
├── cards.html                  ← 12 wallet cards (laminate these)
├── gear.html                   ← Gear checklist (localStorage)
├── tools.html                  ← 9 interactive calculators
├── literature.html             ← Reference library
├── ai-setup.html               ← Bunker Bot / Ollama setup guide
├── changelog.html              ← Version history
├── manifest.json               ← PWA manifest
├── sw.js                       ← Service worker (offline caching)
├── offline.html                ← Offline fallback page
├── sections/                   ← 23 content section pages
│   ├── food.html
│   ├── medical.html
│   ├── energy.html
│   ├── shelter.html
│   ├── communications.html
│   ├── navigation.html
│   ├── security.html
│   ├── knowledge.html
│   ├── agriculture.html
│   ├── animal.html
│   ├── nbc.html
│   ├── disasters.html
│   ├── climate.html
│   ├── metallurgy.html
│   ├── governance.html
│   ├── psychology.html
│   ├── chemistry.html
│   ├── textiles.html
│   ├── vehicles.html
│   ├── build-power.html
│   ├── build-structures.html
│   ├── medicine-making.html
│   └── build-water.html
├── pdfs/                       ← Bundled reference PDFs
│   └── index.html              ← PDF library browser
├── search/
│   ├── search-index.json       ← Client-side search index
│   └── pdf-chunks.json         ← Full-text PDF search index (~5.7 MB)
└── assets/
    ├── css/style.css           ← All styles (dark, hi-contrast, night vision)
    ├── icons/icon.svg          ← PWA app icon
    └── js/
        ├── app.js              ← Navigation, sidebar, icons, PWA setup
        ├── search.js           ← Client-side full-text search
        ├── bunker-bot.js       ← Bunker Bot panel and Ollama integration
        ├── tools.js            ← Calculator functions
        ├── librarian.js        ← PDF library search
        ├── shared-progress.js  ← localStorage progress tracking
        ├── skills-data.js      ← Skill definitions and SVG diagrams
        └── skills.js           ← Practical Skills UI engine
```

---

## Technical Notes

### Offline / file:// Protocol

The guide is designed to work from `file://` — no server required. Two browser restrictions apply:

| Feature | file:// | http://localhost |
|---------|---------|-----------------|
| localStorage | ✅ All browsers | ✅ All |
| Service worker (PWA) | ❌ Not supported | ✅ All |
| Bunker Bot (Ollama) | ⚠️ Needs CORS flag | ✅ All |

**To serve locally (enables PWA caching):**
```bash
python3 -m http.server 8080 --directory /path/to/last-light
# Open: http://localhost:8080
```

**Bunker Bot CORS fix for file://:**
```bash
OLLAMA_ORIGINS=* ollama serve
```

### Display Modes

| Mode | When to use |
|------|-------------|
| Normal (dark) | Default — comfortable in low light |
| Hi-C | Maximum contrast — visually impaired users |
| NV (night vision) | Red tones — preserves scotopic vision outdoors |

Toggled via the pill bar fixed to the bottom of every page. Persisted across sessions.

Font size (Normal / A+ / A++) is also persisted.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Escape` | Close sidebar / Bunker Bot panel / search |
| `Ctrl+P` | Print current page |
| `← →` | Navigate steps in Practical Skills modal |
| `Tab` | Skip-nav link (first Tab press on any page) |

### Print

Every page has a full `@media print` stylesheet. Sidebar, Bunker Bot panel, and UI chrome are hidden. Page numbers and the guide title print in the footer.

Special print pages:
- `quick-reference.html` — formatted for 2-page US letter
- `cards.html` — formatted for wallet card stock
- Practical Skills — each skill can be printed as step-by-step cards via the **Print** button in the skill modal

### PWA / Install

On supported browsers (Chrome, Edge, Safari iOS), the guide can be installed as a Progressive Web App. An install prompt appears on second visit on mobile. Once installed, it works fully offline with no browser chrome.

---

## Verifying Your Copy

After copying the folder to a USB drive or another machine, confirm nothing was
corrupted or lost in transit:

```bash
sh verify.sh
```

This re-computes a SHA-256 for every catalogued file and checks it against
`MANIFEST.sha256`. `✓ All N files present and unchanged.` means the copy is
intact; anything else lists the files that are missing or altered.

To regenerate the manifest after intentionally changing files:

```bash
find . -type f ! -path './.git/*' ! -path './.claude/*' ! -path './node_modules/*' \
  ! -name '.DS_Store' ! -name 'MANIFEST.sha256' \
  | sed 's|^\./||' | LC_ALL=C sort \
  | while IFS= read -r f; do shasum -a 256 "$f"; done > MANIFEST.sha256
```

---

## Contributing

No build system, no dependencies. To add a section:

1. Copy an existing file from `sections/`
2. Add an entry to `NAV_PAGES` in `assets/js/app.js`
3. Add the page path to `PRECACHE` in `sw.js`
4. Add search entries to `search/search-index.json`

All icons are inline SVG strings defined in `assets/js/app.js` (`window.ICONS`). No icon fonts, no CDN calls, no external resources of any kind.

---

## License

**Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**

You are free to share and adapt this material for any purpose, even commercially, as long as you give attribution and distribute your contributions under the same license.

**Public domain sources incorporated:**
- FEMA wood gasifier plans
- US Army Field Manual 21-76 (Survival)
- Hesperian Health Guides (CC BY-SA)
- *Nuclear War Survival Skills* — Cresson Kearny / OISM (public domain)
- USDA planting zone data
- FCC emergency frequency allocations

---

*The Last Light Survival Guide — v1.0.0 — June 2026*  
*Total size: ~2 MB core + 5.7 MB PDF index — fits on any USB drive made in the last 20 years*
