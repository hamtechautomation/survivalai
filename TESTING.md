# Pre-Launch Testing Checklist

A cold-run checklist before going public. The goal: prove the guide actually
works for a real person on real hardware — not just in a developer's browser.
Work top to bottom; tick each box on the devices listed.

> Tip: serve locally with `python3 -m http.server 8000` and open
> `http://localhost:8000/` — the service worker, search, maps, and AI all need
> HTTP (not a raw `file://` path) to work fully.

---

## 1. The cold USB run (most important)
Copy the **whole folder** (including `pdfs/` and `maps/`) to a USB stick, then
open it on a machine that has never seen it.

- [ ] `index.html` opens and looks right with no internet connected
- [ ] Sidebar navigation loads; every section link opens its page
- [ ] `sh verify.sh` reports **all files present and unchanged**
- [ ] Total size is what you expect (~600 MB with PDFs + one map)
- [ ] Works from a folder path with spaces / on a different OS than you built on

## 2. Offline behaviour
- [ ] Load the site once over `http://localhost`, then **turn off Wi-Fi** and reload — pages still open (service worker cache)
- [ ] Install as a PWA (Chrome/Edge "Install", iOS Safari "Add to Home Screen"); launch it with the network off — it works
- [ ] An unknown URL falls back to `offline.html`, not a browser error

## 3. Search
- [ ] Press `/` (or click the box) and search "bleeding", "water", "antibiotic" — relevant results appear
- [ ] Clicking a result jumps to the right page and anchor
- [ ] Search works with the network off

## 4. Bunker Bot (offline AI)
- [ ] With **Ollama** running (`OLLAMA_ORIGINS=* ollama serve`, a model pulled): open Bunker Bot, ask "how do I treat a deep bleeding wound" — it answers
- [ ] The answer shows **source citation chips** (e.g. *Where There Is No Doctor, p.X*) under it
- [ ] Ask a dosing question — it defers to the calculator/refuses to invent a number
- [ ] With Ollama **off**: it shows a clear "not running" message and offers Claude mode
- [ ] Claude mode: paste an API key, ask a question, get a streamed answer
- [ ] Emergency mode toggle changes the tone to direct, numbered steps
- [ ] Citations/RAG work on a **section page**, not just the library page

## 5. Interactive tools (`tools.html`)
- [ ] Antibiotic Dosing Calculator: enter a child's weight + drug — sane mg, tablets/mL, capped at adult max, warnings show
- [ ] Each calculator (food, water, solar, supply, planting, firewood, crop, latitude, timer) produces a result and no console errors
- [ ] Survival Timer beeps at zero (allow audio)
- [ ] Data that should persist (supply tracker, gear list) survives a reload

## 6. Offline maps (`maps.html`)
- [ ] Map renders the region and you can pan/zoom (served over HTTP)
- [ ] Region picker lists the available map(s); switching works
- [ ] "Locate me (GPS)" drops a pin (allow location)
- [ ] On a **Raspberry Pi / low-end device** browser it still renders acceptably
- [ ] `sh extract-map.sh <name> <bbox> 12` downloads a new region and it appears in the picker
- [ ] If the `.pmtiles` file is missing, the "no map file" panel shows (not a blank box)

## 7. PDF library (`pdfs/index.html`)
- [ ] Every card opens its PDF; none 404
- [ ] Filters (Medical, Military, Literature, Reference, AI-searchable) work
- [ ] "Save offline" caches a PDF and it opens with the network off

## 8. Print / paper
- [ ] `quick-reference.html` prints clean on 2 pages (Print → PDF)
- [ ] `cards.html` prints with cards laid out for cutting
- [ ] `index-print.html` prints the full master index
- [ ] A normal section page prints without the sidebar/chrome

## 9. Mobile
- [ ] On a real phone: sidebar opens/closes, nothing overflows, text is readable
- [ ] Background doesn't scroll when the menu/Bunker Bot panel is open (iOS)
- [ ] Display-mode bar (Normal / Hi-C / NV) and font-size (A / A+ / A++) work and persist

## 10. Cross-browser
- [ ] Chrome / Edge
- [ ] Firefox
- [ ] Safari (macOS + iOS)
- [ ] One old/low-end device (the real target audience's hardware)

## 11. Accessibility & polish
- [ ] Tab from the top reveals the "Skip to main content" link
- [ ] Keyboard-only: can search, open sections, navigate
- [ ] No broken links (spot-check footer + cross-section links)
- [ ] No red errors in the browser console on any page

## 12. Content accuracy (do not skip)
- [ ] A **medically qualified person** has reviewed the Medical, Medicine Making,
      and Pregnancy/Infant sections and the dosing tools
- [ ] Medical disclaimers are visible and unmissable on those pages
- [ ] A **ham operator** sanity-checks the comms frequencies/setup
- [ ] A **vet/experienced keeper** checks the animal/veterinary content

---

When every box on your target devices is ticked, you're ready to tag a release
and share it. See the README for distribution (torrent / IPFS / GitHub release).
