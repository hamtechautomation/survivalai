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
- **Grounded in the bundled library** — answers are retrieved from the 28 bundled
  PDFs (BM25 search over ~14,000 text chunks) and cited inline with source +
  page, shown as chips under each answer. Works on every page.
- Local (Ollama) **or** cloud (Claude API) — toggle in the panel
- Model selector, temperature slider, token counter
- Emergency mode (direct, step-by-step answers with no hedging)
- Copy last response / Export full chat; streaming responses with a stop button

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

### 27 Content Sections

| Section | Key Topics |
|---------|-----------|
| Food & Water | Purification, preservation, foraging, passive fishing, sanitation |
| Medical & First Aid | Trauma, wound care, meds, rabies, tetanus, anaphylaxis, eye injuries |
| Energy | Solar sizing, battery banks, hand tools, fuel storage |
| Shelter & Construction | Expedient shelter, insulation, earthworks, roofing |
| Communications | Ham radio, Morse code, signal mirrors, frequency reference |
| Navigation & Maps | Celestial navigation, star charts, map reading, dead reckoning |
| Security & Defense | Physical hardening, bug-out decision tree, threat assessment |
| Knowledge & Literacy | Education continuity, skill transfer, library curation |
| First Principles | Periodic table, physics/chemistry, key equations, the invention method |
| Agriculture | Seed saving, planting calendars, soil health, crop rotation |
| Animal Husbandry | Chickens, goats, rabbits, bees, housing and feeding |
| Veterinary Care | Vital signs, diseases by species, parasites, birthing, biosecurity |
| Pregnancy & Infant Care | Prenatal, labour, birth danger signs, newborn & infant care |
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
| Practical Projects | Cooling/aircon, air filters, dams & hydro, pumps, toilets, radiation checking, mills, breeding, food storage |
| Practical Skills | 36 step-through visual skill guides across 7 categories |

### Practical Skills Section

`skills.html` provides interactive step-by-step guides for hands-on survival skills. Each skill includes:

- Guided step-through mode with keyboard navigation (← →)
- Inline SVG diagrams for key techniques
- Built-in countdown timers for timed steps
- CPR metronome (110 bpm, auto-pauses at 30 for breaths)
- Practice session logging and competency rating (None → Getting There → Competent → Can Teach)
- Instructor notes with common mistakes and fast-track tips
- Printable step cards

**Skill categories:** Fire (9) · Knots (11) · Navigation (5) · First Aid (4) · Hunting & Fishing (4) · Plant ID (3) · Construction (4, incl. blade sharpening)

Progress is stored locally via `localStorage` and can be exported/imported as JSON for backup or sharing across devices.

### 14 Interactive Tools (all offline, no server required)

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
| Antibiotic Dosing Calculator | Weight-based pediatric/adult dosing for 8 antibiotics, tablets/mL per dose |
| Survival Timer & Priorities | Rule of 3s + countdown timers (boil/bleach/CPR/tourniquet) with beep |
| Celestial Latitude Finder | Latitude from Polaris or the noon sun — no GPS |
| Firewood & Heating Estimator | Wood needed to heat a space (lb/day, cords) |
| Crop Spacing & Seed Planner | Plants per bed and seeds to sow, with germination margin |

### Other Pages

- **`quick-reference.html`** — 2-page printable emergency card covering the first 72 hours
- **`cards.html`** — 14 wallet-sized lamination cards (water purification, Morse, wound care, dental, solar troubleshooting, etc.)
- **`gear.html`** — Interactive gear checklist with localStorage persistence
- **`ai-setup.html`** — Step-by-step Bunker Bot / Ollama setup with troubleshooting
- **`expansion.html`** — Expansion Library: one-click links to download all of Wikipedia, Project Gutenberg, and offline maps (Kiwix/ZIM + OSM)
- **`maps.html`** — Interactive offline browser map (PMTiles) with a region picker; works on a minimal static server, no internet
- **`index-print.html`** — Printable master index of the whole archive (for paper)

---

## File Structure

```
last-light-survival-guide/
├── index.html                  ← Dashboard — start here
├── skills.html                 ← Practical Skills — 36 interactive guides
├── tools.html                  ← 14 interactive calculators
├── quick-reference.html        ← 72-hour emergency card (print first)
├── cards.html                  ← 14 wallet cards (laminate these)
├── gear.html                   ← Gear checklist (localStorage)
├── literature.html             ← Reference library
├── expansion.html              ← Expansion Library (Wikipedia/Gutenberg/maps)
├── maps.html                   ← Offline browser map (PMTiles) + region picker
├── index-print.html            ← Printable master index
├── ai-setup.html               ← Bunker Bot / Ollama setup guide
├── changelog.html              ← Version history
├── manifest.json               ← PWA manifest
├── sw.js                       ← Service worker (offline caching)
├── offline.html                ← Offline fallback page
├── verify.sh                   ← Check a copied archive is intact (SHA-256)
├── MANIFEST.sha256             ← Checksums for verify.sh
├── make-torrent.sh             ← Build a torrent for P2P distribution
├── get-knowledge.sh            ← Download a Kiwix ZIM (Wikipedia/Gutenberg…)
├── extract-map.sh              ← Carve any region of the world into a map file
├── sections/                   ← 27 content section pages
│   ├── food.html               medical.html        energy.html
│   ├── shelter.html            communications.html navigation.html
│   ├── security.html           knowledge.html      science.html (First Principles)
│   ├── agriculture.html        animal.html         veterinary.html
│   ├── maternal.html           nbc.html            disasters.html
│   ├── climate.html            metallurgy.html     governance.html
│   ├── psychology.html         chemistry.html      textiles.html
│   ├── vehicles.html           build-power.html    build-structures.html
│   ├── medicine-making.html    build-water.html    projects.html (Practical Projects)
├── pdfs/                       ← 28 bundled reference PDFs (gitignored; on the USB)
│   ├── index.html              ← PDF library browser
│   └── extract.py              ← Rebuilds the PDF search index
├── maps/                       ← Offline map data (.pmtiles, gitignored; on the USB)
├── search/
│   ├── search-index.json       ← Client-side page search index
│   └── pdf-chunks.json         ← Full-text PDF search index for Bunker Bot (~29 MB)
└── assets/
    ├── css/style.css           ← All styles (dark, hi-contrast, night vision)
    ├── icons/icon.svg          ← PWA app icon
    ├── vendor/maps/            ← Leaflet + protomaps-leaflet + pmtiles (offline map renderer)
    └── js/
        ├── app.js              ← Navigation, sidebar, SVG icons, PWA setup
        ├── search.js           ← Client-side full-text search
        ├── bunker-bot.js       ← Bunker Bot panel, Ollama/Claude, RAG + citations
        ├── librarian.js        ← PDF library + BM25 retrieval for Bunker Bot
        ├── tools.js            ← Calculator functions
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

## Expanding the Library — Wikipedia, Gutenberg & Maps

The guide's portable core is small (~30 MB without the bundled PDFs). When you
have internet, the **Expansion Library** (`expansion.html`) turns it into a
launchpad for the rest of recorded knowledge — all read **offline** afterwards:

- **Wikipedia & Project Gutenberg** via [Kiwix](https://kiwix.org) ZIM files —
  medical Wikipedia (~1–2 GB), Simple Wikipedia, full Wikipedia (maxi ~100 GB /
  nopic ~55 GB / mini ~10 GB), all 70k+ Gutenberg books, iFixit, Wiktionary and
  more. `get-knowledge.sh <zim-url>` downloads one (resumable).
- **Offline maps.** `maps.html` renders OpenStreetMap data from a single
  `.pmtiles` file directly in the browser — no map server, no per-view tile
  downloads, no internet. It uses Leaflet + protomaps-leaflet (Canvas 2D, runs
  on a Raspberry Pi) and loads the whole regional file into memory with one
  plain GET, so it needs **no HTTP byte-serving** and works on `python -m
  http.server`. A region picker switches between downloaded maps.

**Download a map of anywhere:**

```bash
# carve any bounding box out of the global map (megabytes, not the 100 GB planet)
sh extract-map.sh <name> <minLon> <minLat> <maxLon> <maxLat> [maxzoom]
# example — Greater London at street detail:
sh extract-map.sh london -0.55 51.25 0.30 51.70 14
```

The script auto-downloads the `pmtiles` tool and pulls only your box via HTTP
range requests, then drops `maps/<name>.pmtiles` into the folder where the map
page's region picker will find it. (`maps/*.pmtiles` and `pdfs/*.pdf` are
gitignored — large data travels on the USB copy, not in git.)

> Maps must be served over HTTP (even `python3 -m http.server` works) — browsers
> block reading large local files from a raw `file://` path.

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

## Sharing It Widely (Censorship-Resistant Distribution)

This guide is meant to spread freely and survive takedowns. Two peer-to-peer
methods let it propagate with no central server to block:

### BitTorrent

```bash
sh make-torrent.sh
```

This builds a `.torrent` of the whole folder (needs `mktorrent` or
Transmission's `transmission-create`). Open the resulting file in any
BitTorrent client and **seed** it; then share the `.torrent` file or its
magnet link anywhere. As long as one person seeds, the entire archive —
including the PDF library — stays downloadable by anyone. Nothing is published
until you choose to seed.

### IPFS

If you run [IPFS](https://ipfs.tech):

```bash
ipfs add -r --quieter .
```

The final hash it prints is a permanent content address. Anyone can fetch the
whole guide with `ipfs get <hash>`, or view it through a public gateway at
`https://ipfs.io/ipfs/<hash>`. The content is addressed by its hash, so it
can't be silently altered, and it stays reachable as long as any node pins it.

Both methods pair well with the `MANIFEST.sha256` check above: recipients can
verify what they received is byte-for-byte the original.

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
*Portable core ~30 MB · full bundle with 28 PDFs + a regional map ~600 MB · fits any pen drive — and expands to all of Wikipedia, Gutenberg and world maps on demand.*
