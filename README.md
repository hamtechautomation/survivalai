# The Last Light Survival Guide
**Complete Offline Preparedness Knowledge Base — v1.0.0**

A comprehensive, dependency-free survival reference built for the grid-down scenario. Zero internet required after download. Works from a USB drive, laptop, tablet, or phone. No accounts, no tracking, no ads.

---

## Quick Start

1. **Copy this folder** to a USB drive or local directory
2. **Open `index.html`** in any modern web browser
3. **Bookmark it** — Ctrl+D / Cmd+D

> **Tip:** Print `quick-reference.html` and `cards.html` before an emergency. Laminate the wallet cards.

---

## Setting Up ARIA (Offline AI Assistant)

ARIA connects to [Ollama](https://ollama.ai) running on your local machine. It is completely optional — the guide is fully usable without it. When Ollama is running, click the **🤖 ARIA** button on any page to open the chat panel.

ARIA features:
- Model selector (switch between installed models)
- Temperature slider (focused ↔ creative)
- Token counter
- Emergency mode (direct, step-by-step answers with no hedging)
- Copy last response / Export full chat
- Streaming responses with stop button

### macOS — Apple Silicon (M1/M2/M3/M4)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (phi3:mini fits in 4 GB RAM)
ollama pull phi3:mini

# Start with CORS open (required when opening from file://)
OLLAMA_ORIGINS=* ollama serve
```

To run Ollama automatically on login, add to `~/.zshrc`:
```bash
export OLLAMA_ORIGINS='*'
```
Then `launchctl load ~/Library/LaunchAgents/com.ollama.ollama.plist` (created by installer).

### macOS — Intel

Same as Apple Silicon. Recommended: `llama3:8b` (8 GB RAM) or `phi3:mini` (4 GB RAM).

### Windows 10 / 11

1. Download the Ollama installer from [ollama.ai](https://ollama.ai)
2. Run the installer (adds Ollama to system tray)
3. Open PowerShell or Command Prompt:
```powershell
# Allow CORS from file:// URLs
$env:OLLAMA_ORIGINS = "*"

# Pull a model
ollama pull phi3:mini

# Start the server (or use the tray icon)
ollama serve
```

To set `OLLAMA_ORIGINS` permanently: System Properties → Environment Variables → New User Variable → `OLLAMA_ORIGINS` = `*`

### Linux — Ubuntu / Debian

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3:8b
OLLAMA_ORIGINS=* ollama serve
```

To run as a systemd service:
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

### Linux — Arch / Manjaro

```bash
yay -S ollama
# or: paru -S ollama
ollama pull phi3:mini
OLLAMA_ORIGINS=* ollama serve
```

### USB Drive / Air-Gapped Machine

1. On a connected machine: `ollama pull llama3:8b` (downloads to `~/.ollama/models/`)
2. Copy the entire `~/.ollama` folder to USB
3. On the air-gapped machine: install Ollama, then copy the `~/.ollama` folder back
4. Run `OLLAMA_ORIGINS=* ollama serve` — models load from the copied folder

### Recommended Models by Hardware

| Model | VRAM / RAM | Speed | Quality | Notes |
|-------|-----------|-------|---------|-------|
| `phi3:mini` | 4 GB | ⚡⚡⚡ | Good | Best for constrained hardware |
| `gemma3:4b` | 6 GB | ⚡⚡⚡ | Good | Fast, good instruction following |
| `llama3:8b` | 8 GB | ⚡⚡ | Very Good | Best balance of speed/quality |
| `mistral:7b` | 8 GB | ⚡⚡ | Very Good | Excellent at structured output |
| `llama3:70b` | 48 GB+ | ⚡ | Excellent | Best quality, needs a workstation |

---

## Content Overview

### 19 Content Sections

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
| Metallurgy | JABOD forge, blacksmithing, smelting, nail making |
| Governance | Community organization, conflict resolution, resource allocation |
| Psychology & Morale | Stress management, group dynamics, box breathing, grief |
| Chemistry & Materials | Soap making, bleach production, fermentation chemistry |
| Textiles & Clothing | Spinning, weaving, leather tanning, pattern cutting |
| Vehicles & Transport | Fuel stabilization, EMP hardening, bicycle maintenance |
| Literature Library | 60 essential books with PDF links, tier ratings, tracker |

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
- **`ai-setup.html`** — Step-by-step ARIA / Ollama setup with troubleshooting

---

## File Structure

```
last-light-survival-guide/
├── index.html                ← Dashboard — start here
├── quick-reference.html      ← 72-hour emergency card (print first)
├── cards.html                ← 12 wallet cards (laminate these)
├── gear.html                 ← Gear checklist (localStorage)
├── tools.html                ← 9 interactive calculators
├── literature.html           ← Reference library (60 books)
├── ai-setup.html             ← ARIA / Ollama setup guide
├── changelog.html            ← Version history
├── sw.js                     ← Service worker (offline caching)
├── sections/                 ← 19 content section pages
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
│   ├── metallurgy.html
│   ├── governance.html
│   ├── psychology.html
│   ├── chemistry.html
│   ├── textiles.html
│   └── vehicles.html
├── search/
│   └── search-index.json     ← Client-side search index (~130 entries)
└── assets/
    ├── css/style.css         ← All styles (dark mode default, HC, NV modes)
    └── js/
        ├── app.js            ← Navigation, sidebar, keyboard shortcuts
        ├── search.js         ← Client-side full-text search
        ├── aria.js           ← ARIA panel and Ollama integration
        └── tools.js          ← Shared calculator functions
```

---

## Technical Notes

### Offline / file:// Protocol

The guide is designed to work from `file://` — no server required. Two known browser restrictions apply:

| Feature | file:// | HTTP (localhost) |
|---------|---------|-----------------|
| localStorage | ✅ Chrome, Firefox | ✅ All |
| Service worker | ❌ Not supported | ✅ All |
| ARIA (Ollama) | ⚠️ Needs CORS flag | ✅ All |

**To serve locally (enables service worker):**
```bash
# Python 3
python3 -m http.server 8080 --directory /path/to/last-light
# Then open: http://localhost:8080
```

**ARIA CORS fix for file://:**
```bash
OLLAMA_ORIGINS=* ollama serve
```

### Accessibility

- Skip navigation link (Tab on any page → "Skip to main content")
- WCAG AA color contrast in all three color modes
- ARIA roles and live regions on chat panel
- Font size toggle (Normal / A+ / A++) persisted to localStorage
- High contrast mode and night vision mode via mode bar

### Color Modes

| Mode | When to use |
|------|-------------|
| Normal (dark) | Default — comfortable in low light |
| Hi-C | Maximum contrast — visually impaired users |
| NV (night vision) | Red tones preserve scotopic vision for outdoor use |

All modes are toggled via the pill bar fixed to the bottom of every page and persisted across sessions.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Ctrl+K` / `Cmd+K` | Focus search |
| `Escape` | Close sidebar / ARIA panel / search |
| `Ctrl+P` | Print current page |
| `Tab` | Skip nav link (first Tab press) |

### Print

Every page has a full `@media print` stylesheet. Sidebar, ARIA panel, and UI chrome are hidden. Page numbers and the guide title print in the footer via `@page` rules.

Special print pages:
- `quick-reference.html` — formatted for 2-page US letter, no sidebar
- `cards.html` — formatted for wallet card stock

---

## Contributing

This guide is a static file project — no build system, no dependencies. To add content:

1. Copy an existing section file from `sections/`
2. Update the `NAV_PAGES` array in `assets/js/app.js`
3. Add entries to the `SEARCH_INDEX` in `assets/js/search.js`
4. Add entries to `search/search-index.json`
5. Update `sw.js` `URLS_TO_CACHE` array
6. Update `changelog.json` with the new version

All icons are inline SVG or Unicode emoji — no icon fonts or CDN calls.  
All fonts are system fonts — no web font downloads.

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
*Total size: ~2 MB — fits on any USB drive made in the last 20 years*
