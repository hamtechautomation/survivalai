# The Last Light Survival Guide — v2.0

**A complete, offline-first survival library you can keep on a USB stick forever.
No internet, no accounts, no tracking, no ads. Free to download, free to share.**

> Replace before publishing: `LIVE_URL` (your CloudFront/domain) and the
> donation link. Tag this release `v2.0` on GitHub.

---

## What it is

A single folder of plain HTML you open in any browser — works fully offline, on
anything from a phone to a Raspberry Pi to a 15-year-old laptop. It pairs a
hand-written survival reference with an **offline AI assistant that cites its
sources**, a **library of 28 public-domain / open reference books**, **interactive
calculators**, **offline maps**, and one-click access to **all of Wikipedia and
Project Gutenberg**.

## Highlights in v2.0

**Knowledge**
- **27 sections** — food & water, medical & first aid, energy, shelter, comms,
  navigation, security, agriculture, animal husbandry, veterinary, pregnancy &
  infant care, NBC/EMP, disasters, metallurgy, governance, chemistry, and more.
- **First Principles** — the periodic table, key equations, and a repeatable
  method for *inventing* tools when you have no plan.
- **Practical Projects** — 12 build guides: DIY water filters, cooling/AC, dams &
  hydro, water pumps, toilets, grain mills, salt-making, firefighting, and more.
- **36 step-by-step Practical Skills** with practice tracking.

**The offline AI — "Bunker Bot"**
- Runs locally via **Ollama** or a single-file **llamafile** (no install), or
  online via the Claude API.
- **Answers are grounded in the bundled books** — BM25 search over ~14,000 text
  chunks — and **cited inline with source + page**. It won't invent drug doses.

**The library & the world**
- **28 bundled reference books** (US Army field manuals, *Where There Is No
  Doctor/Dentist*, *A Book for Midwives*, Bowditch's *Navigator*, the KJV Bible,
  Shakespeare, and more).
- **Offline maps** rendered in the browser from a single file — pan/zoom with no
  internet, on a Pi. Download a map of anywhere on Earth.
- **Expansion Library** — one-click links to put *all of Wikipedia and Project
  Gutenberg* on your drive via Kiwix.

**Tools & resilience**
- **14 calculators** including a weight-based antibiotic dosing calculator,
  celestial latitude finder, firewood estimator, and crop planner.
- **16 printable wallet cards**, a **printable master index**, an **integrity
  manifest** (`verify.sh`), and **torrent / IPFS** distribution helpers.

## Get it

| Package | Size | Contents |
|---|---|---|
| **Lite** | ~1 MB | The guide app + offline search (bring your own AI model) |
| **Standard** | ~560 MB | Everything: 28 books, the AI search index, and a regional map |

Download from **`LIVE_URL/download.html`**, or clone the repo. Both extract to a
`last-light-survival-guide/` folder — open `index.html`.

> Tip: serve it with `python3 -m http.server` to enable the offline AI, maps, and
> "install as an app" (PWA). Verify your copy with `sh verify.sh`.

## Technical notes
- Pure static HTML/CSS/JS. **Zero dependencies, no build step.** Works on the
  `file://` protocol and on the most minimal static server.
- The offline map uses PMTiles + Leaflet (Canvas 2D, not WebGL) and loads the
  whole regional file into memory — so it needs no special server.

## ⚠️ Important
This guide is a **reference, not professional advice**. The medical content is
compiled from standard public sources and **has not been reviewed by a licensed
clinician** — verify anything critical, and seek qualified help whenever it's
available. Small offline AI models can be wrong; the citations are there so you
can check.

## License
Creative Commons **CC BY-SA 4.0** — share and adapt freely with attribution.
Bundled books retain their own licenses (public domain or CC); the Hesperian
guides are non-commercial — keep them free.

## Support
The project is free and always will be. If it's useful, a donation keeps it
online and growing: **[donation link]**. 100% optional.
