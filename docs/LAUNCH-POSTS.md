# Launch posts (ready to paste)

> Replace `LIVE_URL` and the donation link before posting. (GitHub URL is set.)
> Post the two communities a few days apart, not the same hour.

---

## r/preppers

**Title:**
> I built a free, fully-offline survival guide — 27 sections, 28 reference books, an AI that cites them, and offline maps. Runs off a USB stick. No catch.

**Body:**

I've spent a while building something I wish existed: a complete survival
reference that works with **no internet, no app, no account** — just a folder you
open in any browser. It runs off a USB stick, an old laptop, a phone, even a
Raspberry Pi. It's **free**, and it'll stay free.

What's in it:

- **27 sections** — water, food, medical & first aid, energy, shelter, comms,
  navigation, security, agriculture, animals & veterinary, pregnancy/infant care,
  NBC/EMP, disasters, and more. Plus 12 build projects (DIY water filter, salt,
  pumps, hydro, mills…) and 36 step-by-step skills.
- **28 bundled reference books** (the Army survival/first-aid manuals, *Where
  There Is No Doctor/Dentist*, *A Book for Midwives*, Bowditch's navigation
  bible, and more) — all stored locally.
- **An offline AI assistant** that runs on your own machine and **answers from
  those books, citing the source and page** so you can verify it. It won't make
  up drug doses.
- **Offline maps** you can pan/zoom with no signal, and one-click links to put
  **all of Wikipedia and Project Gutenberg** on your drive too.
- 14 calculators (incl. weight-based antibiotic dosing), printable wallet cards,
  and an integrity check so you know your copy isn't corrupted.

**Two honest caveats**, because this community deserves them:
1. A lot of the content (especially medical) was drafted with AI assistance and
   then checked against standard references, but it has **not been reviewed by a
   licensed clinician yet.** Treat it as a reference, not gospel. **If you're a
   doctor/paramedic/vet/ham/farmer and you're willing to tear apart the relevant
   section, that's exactly the help I'm asking for.**
2. The offline AI is only as good as the small model you run — that's why it
   cites the bundled books.

Download (Lite ~1 MB, or the full ~560 MB library): **LIVE_URL/download.html**
Source / mirror it yourself: **https://github.com/hamtechautomation/survivalai** (CC BY-SA, please share)

No ads, no signup, no upsell. There's an optional donation button if it helps
you and you can spare it, but the whole thing is yours either way. I'd genuinely
love feedback, corrections, and "you got this wrong" — that's how it gets better.

---

## Show HN

**Title:**
> Show HN: An offline survival guide that runs on a Raspberry Pi (static HTML + local LLM with RAG)

**Body:**

It's a complete survival/preparedness reference that works with no internet, no
build step, and no server beyond a static file host — designed for the scenario
where infrastructure is *gone*.

The constraints made it a fun engineering problem:

- **Pure static HTML/CSS/JS, zero dependencies.** The core is ~1 MB and runs from
  the `file://` protocol. No framework, no bundler.
- **Local LLM with citations.** The assistant ("Bunker Bot") talks to **Ollama**,
  a **llamafile**, or the Claude API. It does **BM25 retrieval in the browser**
  over ~14,000 text chunks extracted from 28 bundled public-domain/CC books, and
  feeds the top matches to the model so answers are **grounded and cited with
  source + page**. Adding the big literary texts (Bible, Shakespeare) initially
  wrecked retrieval until I swapped naive term-frequency for proper IDF
  weighting — a nice illustration of why BM25 exists.
- **Offline vector maps.** Real OpenStreetMap data from a single **PMTiles** file,
  rendered with Leaflet + protomaps-leaflet (**Canvas 2D, not WebGL**, so it runs
  on a Pi). It loads the whole regional file into memory with one GET, so it
  needs no HTTP range/byte-serving — works on `python -m http.server`. There's a
  CLI that carves any region out of the global planet file via range requests.
- **Expansion path** to all of Wikipedia and Project Gutenberg via Kiwix ZIMs,
  and torrent/IPFS distribution so it survives takedowns.

Everything is offline-first and degrades gracefully: no AI model → it's still a
searchable reference; no internet → the service worker serves it; no server →
most of it still works off `file://`.

**Honest limitation:** the content is broad and AI-assisted, and the medical
material has *not* been reviewed by a clinician yet — the citations exist so you
can check it. I'd value a hard technical look at the retrieval and the offline
plumbing.

Live: **LIVE_URL** · Source (CC BY-SA): **https://github.com/hamtechautomation/survivalai**

---

## Posting tips
- **r/preppers:** lead with "free" and "offline," not features. Reply to every
  comment; this community rewards humility and punishes marketing voice. Asking
  experts to correct you is genuine *and* good for the project.
- **Show HN:** post on a weekday morning US time. Keep the title factual (no
  hype). Be in the thread to answer technical questions for the first few hours.
- Also worth a share: r/homestead, r/offgrid, r/selfhosted (the offline-AI/Kiwix
  angle), and any ham-radio / wilderness-medicine forums you're part of.
