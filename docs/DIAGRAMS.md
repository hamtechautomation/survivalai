# Diagram review log

Every diagram in the guide's sections, what it shows, and how it was checked.
Diagrams are hand-drawn inline SVG (no images), so they work offline, print in
black ink, and follow Night / High-contrast modes.

**How each new diagram was checked**

1. Facts are taken from the section's own text, so picture and words agree.
2. Those facts were cross-checked against standard references (named below).
   Where the text was wrong, **the text was corrected too** (see "Corrections").
3. Every diagram was rendered and inspected for wrong labels, misleading scale
   or geometry, and text that overflows on a phone.
4. `tests/site-check.js` confirms every page still fits a 390 px phone screen.

Reviewers: the items marked **⚑ needs expert review** are the ones where a
specialist's eye would add the most. Please open a content-correction issue.

---

## New diagrams (one per section, November 2026)

| Section | Diagram (`id`) | What it shows | Checked against |
|---|---|---|---|
| Food & Water | `fig-water3` | Boil 1 min (3 min > 2,000 m); bleach 6–8.25 % 2 drops/L (4 if cloudy), 30 min; SODIS 6 h sun / 2 days overcast, PET ≤ 2 L | Section text; US CDC/EPA emergency disinfection; WHO/Eawag SODIS |
| Water Systems | `fig-firstflush` | T-junction first-flush diverter; ≥1 L per 10 m²; 110 mm pipe ≈104 mm bore → 1.2 m ≈ 10 L | Pipe volume calculated from bore (πr²h) |
| Medical | `fig-nines` | Rule of nines front/back + palm ≈ 1 % rule; adults only | Standard adult rule of nines (sums to 100 %); palm rule (incl. fingers) — **⚑ clinician** |
| Medicine Making | `fig-salve` | 1 cup (240 mL) infused oil + 30 g beeswax, low heat, cold-plate test | Section text; common ~1 oz wax per cup oil ratio |
| Energy | `fig-seriespar` | Two 12 V 8 A panels: series 24 V 8 A; parallel 12 V 16 A | Basic circuit rules |
| Power Generation | `fig-pedalchain` | Pedals → PM DC motor → blocking diode → charge controller → 10 A fuse → battery | Lead-acid charging voltage 13.8–14.4 V; LM7812 datasheet (12 V out, ~1.5 A, ~35 V max in) |
| Shelter | `fig-debrishut` | Ridgepole ≈1½× height on a 1 m forked prop, ribs, ≥60 cm debris, leaf bed, door plug | Section text; standard bushcraft debris-hut method |
| Building & Structures | `fig-rafter` | Span ÷ 20 = min depth (4 m → 200 mm), ≤600 mm centres, ≥50 mm wide — labelled rule of thumb | Section text; flagged as rule of thumb, refer to span tables — **⚑ builder/engineer** |
| Communications | `fig-hfprop` | Day: 20/15 m skip 1,000–10,000 mi, D layer absorbs 80 m; night: 80/40 m 100–1,000 mi, 20–10 m go through; ground wave 50–200 mi | Section text; standard HF propagation (ARRL handbook) |
| Navigation | `fig-declination` | True vs magnetic north; map→compass W add / E subtract; 12° W example 090° ↔ 102° | Worked arithmetic; matches section text and "West is best" mnemonic |
| Security | `fig-doorhard` | 75 mm (3") screws through strike plate into stud, second deadbolt, hinge bolts, stud-mounted bar | Section text; standard door-hardening guidance |
| Knowledge | `fig-archive` | < 18 °C (each 5 °C cooler ≈ doubles paper life), 30–50 % RH, dark, acid-free | Section text (corrected — see below); conservation guidance (Image Permanence Institute / Library of Congress) |
| First Principles | `fig-heatflow` | Conduction, convection, radiation and how to block each | Physics |
| Agriculture | `fig-aframe` | A-frame level, plumb from apex; calibrate by swapping feet; walk the contour | Standard permaculture A-frame method (text corrected — see below) |
| Animal Husbandry | `fig-coop` | 0.37 m² (4 sq ft) floor/bird, run 0.75–0.9 m², roost 45 cm up / 20–30 cm per bird, nest boxes lower than roost, 1 per 3–4 hens, 12 mm hardware cloth, 30 cm apron | Section text; standard poultry-keeping guidance |
| Veterinary | `fig-bloat` | Goat seen from its **left**: rumen on the left; relief point = left paralumbar fossa (behind last rib, below spine, in front of hip); last resort only | Standard ruminant anatomy / bloat first aid — **⚑ vet** |
| Pregnancy & Infant | `fig-labour` | Three stages; placenta 5–30 min; cord tied twice after pulsing stops; watch for bleeding, fundal rub | Section text; WHO essential childbirth care — **⚑ midwife** |
| NBC | `fig-seventen` | 7-10 rule: 1,000 → 100 (7 h) → 10 (2 d) → 1 (2 wk) → 0.1 R/hr (3 mo), log scale | Section text; Glasstone & Dolan t^-1.2 decay (valid ~6 months) |
| Disasters | `fig-flood` | Moving water: 15 cm knocks an adult over, 30 cm can carry a small car, 60 cm floats most vehicles — heights drawn to one scale | Section text; US National Weather Service "Turn Around Don't Drown" |
| Climate | `fig-warmfront` | Cirrus (12–24 h) → cirrostratus/halo → altostratus → nimbostratus | Section text; standard warm-front cloud sequence (Met Office) |
| Metallurgy | `fig-anvil` | Horn, step (soft), face (hardened), hardy hole (square), pritchel hole (round), heel | Section text; standard anvil anatomy |
| Chemistry | `fig-limecycle` | Limestone CaCO₃ —≥900 °C, −CO₂→ quicklime CaO —+water (into water)→ Ca(OH)₂ —+CO₂ from air→ CaCO₃ | Section text; lime-cycle chemistry |
| Textiles | `fig-twist` | Z twist slants like Z's middle (clockwise spindle), S like S's; 2-ply = two Z singles plied S | Section text; standard spinning convention |
| Vehicles | `fig-chainwear` | 24 pins (12 full links) = 12"; replace at 12 1/16", overdue at 12 1/8" | Section text (clarified); standard chain-wear check (≈0.5 % elongation) |
| Salvage | `fig-leadacid` | Resting voltage bands; SoC 11.89 V 0 % · 12.06 V 25 % · 12.24 V 50 % · 12.45 V 75 % · 12.65 V 100 % (flooded, 25 °C); ~10.6 V dead cell | Section text; standard flooded lead-acid SoC table |
| Projects | `fig-zeer` | Pot-in-pot cooler, unglazed clay, wet sand, damp cloth, shade + airflow | Section text; evaporative-cooling physics |
| Governance | `fig-dunbar` | Dunbar layers 5 / 15 / 50 / 150 / 500, each ≈3× the last | Section text; Dunbar's social-brain layers (replaces bars that drew 150 and 500 at the same length) |
| Psychology | `fig-stress` | Alarm (0–24 h) → mobilise (24–72 h) → adapt, or adaptation failure if unresolved | The guide's own framework, labelled as a simplified model — **⚑ psychologist** |

---

## Emergency-card diagrams (`assets/js/emergency-figs.js`)

Shown in Emergency mode and on the printed cards (`print-essentials.html`). Each one
repeats the card's own steps, so the drawing and the text can't disagree.

| Card | Figure key | What it shows | Checked against |
|---|---|---|---|
| Not breathing | `cpr` | Hands on the centre of the chest, beat at 110/min | Resuscitation Council UK / AHA 2020 |
| Heavy bleeding | `tourniquet` | Tourniquet 5–7 cm above the wound, not on a joint, time written | TCCC / Stop the Bleed |
| Seizure | `recovery` | Recovery position | St John Ambulance / Red Cross |
| Choking | `choking` | Adult: back blows between the shoulder blades, fist just above the navel, pull in and up. Baby: face-down on the forearm, head lower, 5 back blows then 5 two-finger chest thrusts | Resuscitation Council UK 2021; NHS |
| Severe allergy | `epipen` | Auto-injector into the outer thigh, halfway between hip and knee, through clothing, hold 3 s, second dose after 5 min | Resuscitation Council UK anaphylaxis 2021; MHRA |
| Burn | `burn` | Cool running water 10–20 min, cool not icy, then cling film | NHS; British Burn Association |
| Too cold | `cold` | Warm packs at neck, armpits and groin only; hands and feet not first | Wilderness Medical Society hypothermia guideline 2019 |
| Too hot | `heat` | Ice/cold packs at neck, armpits and groin; immersion best, else soak and fan | WMS heat illness guideline 2019 |
| Stroke | `stroke` | FAST panels | NHS / Stroke Association |
| Low blood sugar | `sugar` | ~15 g fast sugar (4 tablets / small juice / 1 tbsp honey), wait 15 min, repeat | ADA "15-15 rule"; NHS |
| Broken bone | `fracture` | Splint covering the joint above and below, ties off the break, check pulse/feeling/movement before and after | St John Ambulance; Red Cross |
| Snakebite | `snake` | Pen line and time at the swelling edge, repeated; limb still; no cut/suck/tourniquet/ice | WHO snakebite guidelines 2016 |
| Poisoning | `poison` | By route: swallowed (rinse, don't induce vomiting), fumes (fresh air), skin and eyes (rinse 15–20 min); CO warning | NHS; US Poison Control |
| Head injury | `head` | The eight danger signs from the card | NICE CG176 |
| Diarrhoea & dehydration | `ors` | 1 L water + 6 level tsp sugar + ½ level tsp salt | WHO home ORS recipe |

⚑ **needs expert review:** limb position after snakebite. The card says "below heart
level"; some guidelines say "at heart level" or simply "immobilised". The figure
follows the card. Change both together if a reviewer advises it.

---

## Deadly lookalikes, side by side

Three comparison figures. The two plant figures are in Climate (`#lookalikes`, after the
illustrated plant cards). The mushroom figure is in Food & Water, under the chanterelle
entry. Each figure leads with the dangerous plant's tell-tale features and states that
no single feature proves a plant is safe.

| Figure (`id`) | Edible vs lookalikes | Features shown | Checked against |
|---|---|---|---|
| `fig-look-garlic` | Wild garlic vs lords-and-ladies vs lily of the valley | Ramsons: garlic smell, one leaf per stalk, soft matt pointed leaf, white star umbel. Arum: no smell, arrow-shaped glossy leaf, branching net veins, often dark spots, red berry spike later. Lily of the valley: no smell, usually 2 leaves sheathing one stem, white bells hanging on one side. Caption warns that garlic smell lingers on the fingers | Woodland Trust; RHS; Kew Plants of the World; Mabey *Food for Free* |
| `fig-look-umbel` | Wild carrot vs poison hemlock vs hemlock water dropwort | Daucus: hairy stem, long forked bracts ("ruff"), often a dark central floret, carrot smell, "bird's nest" seedhead. Conium: smooth hairless stem, purple blotches, powdery bloom, mousy smell, tall. Oenanthe crocata: wet ground, grooved hollow stem, pale finger-like tubers, yellowish sap from cut root, parsley smell. Caption: avoid all white umbellifers without expert confirmation | Botanical Society of Britain & Ireland; Poisonous Plants in Britain (HMSO); Kew |
| `fig-look-chanterelle` | Chanterelle vs false chanterelle vs jack-o'-lantern | Cantharellus: blunt forked ridges running down the stem, pale flesh, on soil, fruity smell. Hygrophoropsis: thin crowded forking true gills, deeper orange, on conifer litter or wood chip (causes stomach upset). Omphalotus: sharp true gills, tight clusters on wood or buried roots, orange flesh throughout, gills may glow (toxic, violent vomiting) | British Mycological Society; Phillips *Mushrooms*; First Nature |

⚑ **needs expert review:** all three lookalike figures. A forager or botanist should confirm
the drawings aren't misleading at phone size. Wild carrot is labelled "edible root",
but the caption says not to eat any white umbellifer without expert confirmation.

---

## How diagrams behave on the page (`setupDiagrams` in `assets/js/app.js`)

Applies automatically to every inline `<svg viewBox>` in a page's content that is at least 150 units
wide (icons, banners and buttons are skipped).

- **Enlarge:** an Enlarge button sits in the corner, and tapping the diagram also opens it. It opens
  full screen with pinch, wheel, +/− and double-tap zoom, and drag to pan. Esc, ✕ or the phone's
  Back button closes it.
- **Draw-in:** the first time a diagram scrolls into view, its outlines draw themselves and the fills
  and labels fade in. This is skipped for "reduce motion" and when printing. The extra attributes are
  removed afterwards. To exclude a part, give it the class `no-anim`.
- **Highlight:** give a drawn part (or a `<g>` around several parts) and its label the same
  `data-hl="key"`. Hovering, tapping or focusing either one lights both up and dims the rest. A
  "Tap a feature" hint is added to the caption automatically. Used in the lookalike comparisons,
  and ready for any other diagram.

---

## Step-by-step animated diagrams (`figure.dg-player`)

Each one has Back / Play / Next controls and a clickable numbered step list. It plays once by itself
the first time it scrolls into view (not with reduce motion). Print and no-JS show the finished state
with all the steps listed. Parts carry `data-s="a-b"`, meaning they are shown on steps a to b.

| Page | Diagram (`id`) | Steps | Checked against |
|---|---|---|---|
| Navigation | `fig-polaris` (replaces the old text-art sketch) | Plough → pointers Merak→Dubhe → 5× the gap → Polaris, drop to horizon = true north | Section text; star positions schematic, pointer geometry exact (Polaris placed at 5× the Merak–Dubhe gap) |
| Navigation | `fig-shadowstick` | Stick and 1st mark → wait 15–20 min, 2nd mark → W→E line → left foot on 1st, right on 2nd = facing north. Sun position matches each shadow | Section text; US Army FM 3-25.26 |
| Medical | `fig-tourniquet-steps` | Wide cloth wrapped twice 5–7 cm above the wound, not on a joint → half knot, stick, full knot → twist until bleeding stops → stick tied down, "TK" + time | Section text; TCCC improvised-tourniquet guidance |
| Medical | `fig-recovery-steps` | Near arm at a right angle → far hand to near cheek → far knee up, pull to roll → on side, top knee at a right angle, head tilted back | Section text; Resuscitation Council UK / St John Ambulance |

**Text corrected:** Navigation › Shadow Stick said "first mark = west, second = east in
Northern Hemisphere". It is true in **both** hemispheres, because the sun always moves east
to west, so the text now says so.

---

## More diagrams for the thinnest sections

| Section | Diagram (`id`) | What it shows | Checked against |
|---|---|---|---|
| Veterinary | `fig-presentation` | Normal "diving" presentation (two front feet, nose on top) vs head-only/legs back, feet/head back, breech; when and how to help | Section text; Merck Veterinary Manual (dystocia, small ruminants) |
| Veterinary | `fig-famacha` | Lower-eyelid colour scale 1 (red) to 5 (white); treat 4–5, and 3 if in doubt; treat individuals only | Section text; FAMACHA© guidance (Univ. of Pretoria / ACSRPC). Screen colours approximate |
| Maternal | `fig-newborn` | Dry and warm skin-to-skin → stimulate, clear mouth then nose → after 30–60 s, small puffs over nose and mouth ~40/min, head level → cord tied and cut after pulsing stops, breast within the hour | Section text; WHO *Helping Babies Breathe*; Resuscitation Council UK NLS |
| Science | `fig-lever` | Lever: load × a = effort × b (200 kg × 0.5 m = 50 kg × 2 m). 2:1 pulley: rope anchored, under the moving pulley, over the fixed pulley | Section text; standard mechanics |
| Science | `fig-345` | 3-4-5 right angle with pegs and string, larger multiples, equal-diagonals check | Section text |
| Communications | `fig-groundair` | V, X, →, F, LL, N, Y, SOS laid in logs, person for scale | Section table; ICAO Annex 12 ground-to-air visual signal code |
| Projects | `fig-latrine` | ≥30 m from water and downhill of it, pit bottom above the water table, downwind of the kitchen, tippy-tap | Section text; WHO/Sphere sanitation standards |
| Animal | `fig-rabbit-cycle` | Mate day 0 (doe to buck) → palpate 10–14 → nest box 28 → kindles 31 → check nest next day → wean 6–8 weeks | Section text |

⚑ **needs expert review:**
- `fig-newborn`: a midwife or neonatal nurse should confirm the drawing.
- `fig-presentation`: a vet should confirm the drawing.
- Chemistry › The Cuts said methanol "concentrates first" and is "produced early in every
  distillation run". **Text fixed (November 2026):** it now says methanol is made in the
  fermenter (mostly from fruit pectin), comes through across a pot-still run with more in the
  tails, and that discarding foreshots does not remove it. The rules are now: drink only the
  hearts of a grain or sugar wash; treat fruit spirit as fuel or antiseptic; always discard the
  foreshots; never drink tails. The safety list, the foreshots/tails rows of the cuts table, the
  hazard card and the Salvage still note were brought into line, and the "first 50 mL" in the
  summaries now matches the table's 50–100 mL. ⚑ A chemist should still check it. Not diagrammed.

---

## Display modes × diagrams (audit, November 2026)

All 109 diagrams were captured in Standard, Night, High-contrast and print, and measured
by script (pixel colour, label contrast against the real backdrop, label position).

| Problem found | Scale | Fix |
|---|---|---|
| **Night mode leaked green, blue and white light** | 90 of 108 diagrams, plus about 54,000 spots of page chrome across every page | Three layers. (1) The Night palette now defines every colour token. (2) The content area and enlarged diagrams pass through an SVG filter, `#ll-nv`, that turns any colour into red while keeping its brightness. (3) A full-screen red "gel" (`body.mode-nv::after`, multiply) blocks whatever is left: emoji, photos, map tiles. Result: zero non-red pixels |
| **Colour charts are meaningless in red** | Heat colours, temper colours, eyelid scale | Each shows a note in Night mode: switch to Standard to read it |
| **Older diagrams printed light-on-black** | 41 of 65 older diagrams | Tagged `dg-legacy`; print flips lightness and keeps hue (`invert(1) hue-rotate(180deg)`). The two steel colour charts (`dg-truecolor`) keep real colours |
| **Labels cut off at the edge** | 32 labels in 18 diagrams (plant cards, four-stroke cycle, gasifier, kiln…) | Label moved, or drawing area grown. Now 0, and `site-check` fails if one returns |
| **Faint labels** | 266 of 1,191 labels under 4.5:1 (145 under 3:1) | 211 recoloured individually: same hue, lightened or darkened just enough for its backdrop. The rest are decorative dots or deliberately faded |
| **Labels on top of each other** | 12 pairs (bellows, biodiesel processor, solar wiring, forge…) | Rearranged; crowded titles given their own band |
| Enlarge button covered titles on small plant cards | 9 cards | Button hidden under 340 px wide; tapping the card still enlarges it |
| Contents list repeated "Deadly Lookalikes" 4× | Climate page | Deduplicated |

`home.html` (the marketing landing page) does not load the app script, so it has no display modes.

---

## Knots & Rope (`sections/knots.html`, generated)

The page is written by `python3 tools/knots/build.py`. Edit the generator, not the HTML.

**How the drawings are kept honest.** Each knot is a rope path plus a list of what the rope
does at every crossing (over or under), in order. `tools/knots/rope.py` finds the crossings
itself and refuses to draw unless (a) the list accounts for every crossing found and (b) the
two passes at each crossing disagree. A mistyped crossing is a build error, not a wrong picture.
`python3 tools/knots/knots.py` prints every knot's crossings.

| Knot | Crossings | How the structure was derived | Reference |
|---|---|---|---|
| Bowline | 7 | "Rabbit" sequence. Checked by the textbook test: after "up through the hole" alone, the three crossings alternate, i.e. an overhand knot. Tail finishes inside the loop | Ashley Book of Knots #1010 |
| Sheet bend | 7 | Same structure as the bowline with the loop cut (mirror image, turned on its side). Matches "up through the bight, round the back of both legs, under itself"; end lies across the front of the bight; both short ends on the same side | ABOK #1431 |
| Reef knot | 6 | Two interlocked bights. The reef is point-symmetric (half turn plus flip), which fixes the marks: each rope's two parts pass the same side of the other's bight | ABOK #1402 |
| Granny (comparison) | 6 | Same geometry with plain half-turn symmetry: each rope's two parts pass opposite sides | ABOK #1405 |
| Clove hitch | 2 visible | Front view on a post: two turns under one diagonal; ends leave in opposite directions | ABOK #1245 |
| Taut-line hitch | 8 | Two turns inside the loop working towards the peg, end crosses over its own line, one turn outside in the same direction, tucked under the crossing | ABOK #1856 |
| Trucker's hitch | system | Loop used as a pulley; the loop knot and the two half hitches are shown as blocks, described in the steps, not drawn strand by strand | — |

Text claims and their basis: knots cost roughly a third to a half of rope strength; working load
about a fifth of breaking strength (a tenth where a failure could injure); trucker's hitch 3:1 in
theory, nearer 2:1 with rope friction; taut-line needs a third turn in slick cord.

⚑ **needs expert review:** a rigger, sailor or scout leader should tie each knot from the page
alone and confirm the result. The crossing check proves each drawing is self-consistent and
matches the structure described above; it cannot prove I described the right structure.
The taut-line hitch has several named variants and deserves the closest look.

---

## Daylight mode, full-screen step player, stacked panels (November 2026)

**Daylight mode** (`body.mode-day`, Display → Daylight). The dark design is flipped: lightness
inverted, hue kept (`invert(1) hue-rotate(180deg)` on each top-level block, so fixed bars and
panels stay put). Flipped back to their real colours: photos, map tiles, the steel colour
charts, the eyelid-scale swatches (`.no-flip`), and all plant-identification art (plant cards
and the three lookalike figures), because white flowers must stay white. Print ignores it.

**Full-screen step player.** Enlarging a `figure.dg-player` opens a player, not a frozen frame:
swipe or arrow keys to step, Space or the button to play (it loops and holds the finished
state), the step text shown large, screen kept awake while playing. A phone on its side puts
the picture left and the text right. Closing hands the current step back to the page.

**Stacked panels.** A figure made of separate panels is now one `<svg>` per panel inside
`.dg-cols` (`--cols` on a wide screen, `--cols-sm` on a phone). Split with
`node tools/split-panels.js <page> <figure-id>:<cols>:<cols on phone>`; nothing is redrawn,
each panel just gets its own viewBox. Done for the three lookalike comparisons (3 → 1),
birth presentations (4 → 2), ground-to-air signals (4 → 2), newborn first minutes (2 → 1) and
reef vs granny (2 → 1). On a wide screen Enlarge shows the whole comparison; on a phone it
shows the panel you tapped.

---

## Redrawn diagrams (the ten weakest older ones, November 2026)

Chosen from contact sheets of all 65 older diagrams: tiny or overlapping labels, cramped
layout. Redrawn in the shared `.dg` style by `python3 tools/redraw.py`, so they follow the
display modes, print cleanly, draw in, and enlarge. Every label comes from the diagram it
replaces or the section text beside it. After running `redraw.py` again, re-run
`tools/split-panels.js` for the four multi-panel ones.

| Section | New `id` | What changed besides the look |
|---|---|---|
| Textiles | `fig-welt` | Proper cross-section with both rows of stitching; tap-to-highlight parts |
| Vehicles | `fig-gasifier` | **Title and caption corrected.** It was labelled "FEMA downdraft gasifier — used by millions of WWII vehicles". The drawing (with a throat) is the wartime Imbert type; FEMA's 1989 design is a simpler throatless one. Carbon-monoxide warning added |
| Vehicles | `fig-biodiesel` | Steps numbered to match the text; the methanol percentage is left to the text |
| Vehicles | `fig-fourstroke` | Four panels (stack 2 × 2 on a phone); valves, piston direction and crank drawn per stroke |
| Metallurgy | `fig-bellows` | **Title corrected.** It said "double-action bellows" but showed, and the text describes, a single-chamber bellows. Now drawn as lift/push, with the text's Y-pipe method for a steady blast in the caption |
| Metallurgy | `fig-jabod` | Labels untangled; fire and workpiece position shown |
| Food & Water | `fig-pitlatrine` | **Distance corrected: 60 m → 30 m** from water, matching the same page's well-siting text, the Projects page and WHO/Sphere guidance. 1.5 m above the water table kept |
| Water Systems | `fig-gravity` | Numbered flow; head-to-pressure rule drawn as a dimension |
| Medicine Making | `fig-tincture` | Five steps plus the 1:5 ratio as panels |
| Power Generation | `fig-waterwheels` | Overshot efficiency now "up to ~85%" (it was a flat "~85%"); head and flow explained |

Also removed: the old pedal-generator schematic in Power Generation, which duplicated
`fig-pedalchain` directly above it and still showed a rectifier as a required stage.

⚑ **needs expert review:** `fig-gasifier` (zone temperatures and the gas train come from the
section text), `fig-biodiesel` (process chemistry), and `fig-pitlatrine` (siting figures).

---

## Movement in the first-aid step diagrams (November 2026)

The tourniquet and recovery-position players now move instead of cross-fading. When a step
appears, its parts move into place from where they were: the band wraps on, the stick drops
onto the knot and is spun until tight, blood keeps dripping until it is, the tie draws itself
and the TK tag appears; the near arm swings out to a right angle, the far arm folds to the
cheek, the far knee rises and the body rolls towards you. Done with three CSS classes
(`.mv`, `.mv-draw`, `.mv-drip`); off for reduced motion and in print.

## Redrawn diagrams, second batch (`tools/redraw2.py`)

| Section | New `id` | What changed besides the look |
|---|---|---|
| Power Generation | `fig-blade` | Aerofoil and twist as two panels; the twisted sections are drawn at their real angles to the plane of rotation |
| Water Systems | `fig-swale` | Plan and cross-section as two panels; overflow from swale to swale shown |
| Governance | `fig-disputes` + `fig-disputes-print` | **Two flowcharts that disagreed merged into one.** One said mediation by 3 days and council by 7; the other 48 and 72 hours. The section text says: talk it out within 24 hours, then mediation, then a council hearing within 3 days, then one appeal. Both copies now say exactly that (the second is in the printable templates) |
| Medicine Making | `fig-fever` | **Contradiction removed.** The chart recommended a "cold water bath" while its own caption and the protocol below say never use cold water. Willow bark now carries the page's own "not under 16" rule. Notes that above 41.5 °C is usually heat stroke, which is treated differently (Medical §4) |
| NBC | `fig-falloutshelter` | **Numbers aligned with the page's table**: basement PF 10–100 (was 40–100). Removed "inner shelter PF 200–500" and "exit only below 2 R/hr", which nothing on the page supports |
| NBC | `fig-decon` | Six zones as panels (3 × 2, 2 across on a phone); PPE removal order unchanged |
| Water Systems | `fig-well` | Sealed top 3 m and open-jointed lining below drawn against the soil layers and water table |
| Power Generation | `fig-biogas` | Inlet, dome, gas pipe and displacement chamber; how the pressure is held explained |
| Building | `fig-cob` | Roof now sits on the wall; overhang, plinth and rubble trench dimensioned |

`tools/split-panels.js` fix: it now uses each part's drawn position, including its own
rotation, so rotated parts land in the right panel.

⚑ **needs expert review:** `fig-falloutshelter` (protection factors), `fig-decon` (PPE removal
order), `fig-fever` (thresholds).

---

## Sweep figures, first batch (`tools/sweepfigs.py`)

Drawn where the sweep found the words alone weren't enough. Each is generated in code, placed by a text anchor and safe to regenerate; three replace ASCII-art blocks.

- **Car in water — S·W·C·O** (Disasters, flood): seatbelt, window, children, out, with the water rising panel by panel; replaces the deadly "wait for the pressure to equalise" advice.
- **Three birth emergency positions** (Pregnancy): knee-chest for cord prolapse, McRoberts with suprapubic pressure for stuck shoulders, fundal massage for bleeding. **⚑ midwife check.**
- **START triage flowchart** (Medical; replaces ASCII): includes the airway-repositioning branch.
- **Hazard diamonds 1–9** (Disasters, chemical): true colours kept in daylight mode.
- **Stunning points by species** (Veterinary): cattle, pig, sheep/goat. **⚑ check against HSA guidance.**
- **Quinzhee cross-section** (Shelter): guide sticks, high bed, low entrance, vent; CO warning.
- **Crystal radio** (Communications): antenna → coil → diode → earpiece → earth.
- **Reading a river** (Vehicles): fast water, V's, eddy, strainer, with a numbered key.
- **Figure-four deadfall** (Food; replaces ASCII).
- **Calories per 100 sq ft** (Agriculture): the corrected yield ranges as bars.
- **Baseplate compass parts** (Navigation; replaces ASCII).
- **Discharging a capacitor** (Salvage): bleed, check, short.

### Second batch (`tools/sweepfigs2.py`)

- **New:** defensible-space zones (Disasters), chimney 3-2-10 rule and passive-solar section (Shelter), egg candling (Animals), which crops cross (Agriculture), sweet vs horse chestnut and tick removal (Climate), spark-test streams and sand mould (Metallurgy), micro-hydro layout (Power and Energy), solar box cooker (Energy), drawbored mortise and tenon (Building and Shelter), signal-mirror aiming (Communications), Corsi–Rosenthal cube (Projects), storage-media lifespans (Knowledge), pot still (Chemistry) and water still (Food), pressure-immobilisation bandage (Medical), Kearny fallout meter and nested Faraday storage (NBC), layered defence (Security), six hand stitches, plain vs twill and saddle stitch (Textiles), oil lamp (Chemistry), snare (Food).
- **ASCII art replaced** by these, or removed where a drawn figure on the same page already showed it: solar system, rocket-stove L, gasifier and biogas (Energy — the Vehicles gasifier and Power biogas figures are reused), water filter, rain catchment, pit latrine and rotation (Food — the Agriculture rotation figure is reused), JABOD and nail header (Metallurgy), retort (Chemistry), debris hut (Shelter), four-stroke (Vehicles). The six ASCII stitch boxes became one figure plus a list.
- Left as text on purpose: Morse/number tables, the Caesar cipher, the community ledger, contour-line rules, the rule-of-nines list, the nuclear decision steps and the stress cascade — they read fine as text.
- **⚑ checks:** pressure immobilisation (clinician), KFM (build from the NWSS patterns, not this sketch), stun points and birth positions (from batch 1).

---

## Accuracy sweep — every section (November 2026)

All 29 pages re-read against standard references (WHO, CDC/USDA, NHS/Resuscitation Council UK, HSA, FEMA, NIOSH, EMP Commission, Hugh Piggott, Jeavons, Aprovecho and the guide's own other pages). Each correction below was applied with `tools/sweepfix.py`, which matches visible text through the HTML and refuses any change that would leave tags unbalanced. Items marked **ADD** are new safety notes; **IMG** are pictures planned or drawn (see the next section).

### Maternal
- **FIX** cord stump "dip in antiseptic" vs "keep clean and dry": make consistent (dry care; 7.1% chlorhexidine where infection common)
- **FIX** cord prolapse: add lift presenting part off the cord with gloved fingers
- **ADD** shoulder dystocia danger sign (McRoberts + suprapubic pressure, or all-fours)
- **IMG** emergency positions: knee-chest (cord prolapse), McRoberts + suprapubic (stuck shoulders), fundal massage (bleeding)
### Veterinary
- **FIX** frothy bloat oil dose: cattle 250–500 mL, sheep/goats 100–200 mL
- **FIX** milk fever: never drench an animal that cannot swallow / is flat (aspiration)
- **FIX** humane slaughter: eye-to-opposite-horn X is cattle-only; pig point higher (~2 cm above eye line, midline), sheep/goat top of head (polled) or behind poll (horned) aimed at throat; bleed within 60 s; chest stick for cattle/pigs
- **IMG** stun points: cattle, pig, sheep/goat heads
### Disasters
- **FIX** car in water (hurricane + flood): do NOT wait for door handles/pressure; seatbelt off, window open/break at once, out, children first (SWOC)
- **FIX** hurricane Cat 4/5 actions overstated ("evacuate or die"); add storm-surge point: run from water, hide from wind
- **FIX** wildfire trapped in car: engine running, lights on, AC recirculate, below windows under wool blanket
- **FIX** N95 "ineffective against smoke" -> filters particles (main harm), not CO/gases
- **FIX** flood food: undamaged all-metal commercial cans can be kept after washing+sanitising (USDA); discard home-canned/screw-top/pouch
- **FIX** "CO kills more than the storm/event" (x2) -> a leading cause of death after storms
- **FIX** EMP cars "2000+ likely disabled" -> EMP Commission tests: most kept running or restarted; uncertain
- **FIX** nuclear "take KI if available" -> only if radioiodine fallout expected; thyroid only
- **FIX** Katrina ">100 drowned in attics" unsourced -> soften; Maria deaths attribution soften
- **IMG** hazmat placard classes 1–9; car-in-water escape (SWOC); defensible-space zones around a house
### Shelter
- **FIX** chimney rule: 0.9 m above roof where it exits, and 0.6 m above anything within 3 m (3-2-10)
- **FIX** water heat storage "3x masonry" -> about 2x per volume
- **FIX** thatch life: straw 15–25 y, water reed 50+
- **FIX** sod roof weight 40–80 -> 150–300 kg/m² wet
- **FIX** bark: take from felled trees (stripping a ring kills a living tree)
- **FIX** lean-to: sloping back faces the wind
- **IMG** quinzhee cross-section (guide sticks, platform above entrance, vent); chimney 3-2-10 rule
### Animal
- **FIX** feed conversion: rabbits ~3–4:1, broilers ~2:1, pigs ~3:1, cattle 6–8:1 (rabbits NOT best) — table + §4 intro
- **FIX** rabbit yield "pair 200–300 lb/yr in 3x3 hutch" -> one doe 40–50 young/yr ≈ 45 kg (100 lb) dressed
- **FIX** rabbit space table "1 sq ft" -> hutch ~76×90 cm (30×36") each
- **FIX** eggs 4–6/day "1,000–1,500 kcal" -> ~300–450 kcal; feed "2 lb per dozen" -> ~4 lb (1.8 kg)
- **FIX** "Chicken — Cervical Dislocation" describes decapitation; drop hanging-upside-down "drowsiness"; cone, head off in one stroke
- **FIX** meds: penicillin not toxic to chickens; rabbits injection only, never by mouth; enrofloxacin banned in food birds (US) — last resort
- **FIX** goat minerals garble: goat mineral; sheep mineral lacks copper; never give goat/cattle mineral to sheep
- **FIX** iceberg "toxic" -> poor food, causes diarrhoea; "80% of disease" soften
- **IMG** egg candling day 7 / 14 / 18; feed-to-meat bar chart
### Security
- **FIX** pepper spray/taser/baton "legal most places" -> illegal to carry in UK and many countries; check local law
- **FIX** go-bag Baofeng: transmitting needs a licence except in emergencies (link Comms)
- **IMG** layered defence rings (replace ASCII)
### Agriculture
- **FIX** calorie table: beans 10–20 lb/100 sq ft (real 2–5), wheat 10–15 (4–9), amaranth 10–20 (2–6), corn 15–25 (5–15 garden), potato 50–100 (25–75), sweet potato (25–60), squash (30–60), cassava (30–75); recompute kcal; note roots win per area, grains/beans store
- **FIX** seed saving: squash crosses only within its species (C. pepo / maxima / moschata), not "all cucurbits"; brassicas cross within species (B. oleracea group; B. rapa group), not "ALL"; carrots cross with wild carrot
- **FIX** worm yield: 1 kg castings/week from 0.5 kg waste impossible -> ~0.25 kg
- **FIX** marigold "thiopene" -> alpha-terthienyl (a thiophene)
- **FIX** forced molt by starving: drop (banned/welfare); let them molt
- **FIX** goat milk: Nubian 2–3 L, Alpine 3–4 L (avg); animal page Nubian 2–3 qt; Boer "60 days to harvest" -> market 4–8 months
- **FIX** Kunekune "fastest to finish" -> grazes well but slow (12+ months)
- **FIX** mead: Campden tablet is not a nutrient (it suppresses wild yeast; add 24 h before yeast); beeswax "5× longer" -> longer, less smoke
- **IMG** calories per 100 sq ft bar chart; which crops cross (seed-saving families)
### Climate
- **FIX** "Fool's watercress ... dangerous" — it is edible; real risk is confusing it with hemlock water dropwort. Replace in Deadly Five with death cap (Amanita phalloides)
- **FIX** hawthorn: seeds NOT edible (cyanogenic) — strain them
- **FIX** UK rainfall 885 mm -> UK ~1,150 mm (England ~850)
- **FIX** "Wet-Bulb Hypothermia" -> wet-cold hypothermia
- **FIX** sea purslane "high in omega-3" drop; mist: following streams downhill can lead into gullies — follow paths
- **IMG** sweet chestnut vs horse chestnut (husk, nut, leaf) side by side; tick removal
### Metallurgy
- **FIX** bell metal "95/5" -> about 78% Cu / 22% tin; bronze melts ~950–1,000 °C (not 913), pour ~1,100
- **FIX** tin cans as tin source -> micron coat, useless
- **FIX** oil-bonded sand: needs bentonite + oil (not sand + oil)
- **FIX** "cut nails ... forged by hand" -> wrought (hand-forged) nails; cut nails were machine-cut
- **FIX** hot chisel mild steel -> medium-carbon tempered blue; mild steel deforms
- **FIX** hardening: heat a shade past non-magnetic (not exactly at)
- **FIX** used motor oil quench: toxic fumes (PAHs) — outdoors, upwind; lost foam: styrene fumes outdoors
- **FIX** files: cheap modern files may be case-hardened mild steel — spark test first; railroad "HC" spikes barely harden
- **FIX** loose handle "soak in linseed oil swells it" -> re-wedge; water swelling is temporary
- **FIX** steel carbon range 0.2–2 -> about 0.05–2 (mild 0.05–0.25)
- **IMG** spark-test patterns (mild / high-carbon / cast iron / stainless); sand-casting cope & drag cross-section
- **Layout** remove ASCII art duplicated by SVG figures (JABOD, nail header; also shelter debris hut; food filter/still?)
### Vehicles
- **FIX** bicycle "50× more efficient than walking" (x3) -> about 3–5× less energy per km
- **FIX** bike generator: diode 1N5408 -> 10 A; output 50–150 W -> 50–100 W sustained
- **FIX** EMP: soften "1972 pickup worth more", "Post-1990 vulnerable" -> may be; EMP Commission tests
- **FIX** gasifier ash grate "gas rises and exits sideways" -> in a downdraft gas is drawn down through the grate
- **FIX** biodiesel titration: 1 mL oil in 10 mL alcohol; "zero modification" -> old rubber fuel lines/seals perish; change filters early
- **FIX** ethanol "85%+" -> as strong as you can (90–95%); "don't store in plastic — absorbs water" -> keep sealed; ethanol pulls water from air
- **FIX** thermostat removal "will not overheat" -> soften
- **FIX** donkey load "50–80 lb" -> about 20% of body weight (40–50 kg standard donkey); ox "horses not food" soften
- **FIX** dugout: carve green, seal ends, dry slowly after (not dry 6–12 months first)
- **FIX** steam bending 20–30 min/inch -> about 1 hour per inch
- **FIX** raft buoyancy maths (net 25–30 lb/cu ft dry softwood; 50 cu ft ≈ 1,300 lb at waterline; load half)
- **Layout** remove four-stroke ASCII (figure exists)
- **IMG** reading a river: downstream V, upstream V (rock), eddy, strainer, outside-of-bend
### Salvage
- **FIX** fridge: venting refrigerant is illegal (UK/US) — have it recovered; in a true collapse vent outdoors away from flame
- **FIX** §10 petrol "6–12 months stabilised" -> 1–2 years (matches §15)
- **FIX** vehicles biodiesel methanol 25% -> 20% (match salvage)
- **IMG** safe capacitor discharge: resistor on insulated leads, meter check, shorting wire
### Energy
- **FIX** rocket stove "80–90% efficiency vs 10–20%" and "80–90% less wood" -> ~25–40% vs ~10–15%; about half the wood (30–60% less)
- **FIX** rocket mass heater "5–10% of the wood" -> soften (builders claim a fifth to a tenth)
- **FIX** hydro "each 90° bend ~10 m head" -> a few metres of extra pipe; use long sweeps
- **FIX** parabolic focal point "centre of curvature" -> focal length = D² ÷ (16 × depth) (half the radius of curvature)
- **FIX** biogas: "8–10 people" -> human waste alone gives under an hour; daily load 5% -> ~2–3% (30–60 day retention); yields per kg dry matter; human-waste slurry not pathogen-free (compost/store; not on raw-eaten crops)
- **FIX** Faraday "no gaps larger than the wavelength" -> gaps far smaller than the wavelength; overlapping seams
- **FIX** fuel container colours: US petrol red, diesel yellow, kerosene blue
- **FIX** equalise "monthly" -> when cells differ >0.030 / every 1–3 months; LiFePO4 BMS "in cells" -> in packs
- **Layout** replace ASCII (solar, Pelton, gasifier, rocket L, box cooker, biogas) with figures (reuse fig-gasifier, fig-biogas copies; new Pelton layout + box cooker)
- **IMG** micro-hydro layout with head marked; solar box cooker cross-section
### Build-structures
- **FIX** quinzhee "-5 °C regardless of outside" (quick-fact + text) -> usually around −5 to 0 °C inside even in deep cold; walls 25–30 cm
- **FIX** debris thickness: 1 m here vs 60 cm shelter -> "at least 60 cm; nearer 1 m in frost" both pages
- **FIX** earthbag "flood-proof" -> unstabilised earth softens if soaked; raise on gravel/stone, stabilise lowest courses
- **FIX** "2.5 cm oak shutter stops handgun rounds" -> wood doesn't stop bullets; shutters stop entry; protection = earth/sand/masonry
- **FIX** sandbags "2 bags/4 bags" -> thickness: ~30 cm packed sand for handgun, 45–60 cm for rifle
- **FIX** Czech hedgehog 90 cm -> needs 1.2–1.5 m arms
- **Layout** mortise/drawbore ASCII -> figure
- **IMG** drawbored mortise & tenon (offset hole pulls shoulder tight)
### Build-power
- **FIX** Pelton "10m head = 1 bar = 142 PSI" -> 14.5 psi
- **FIX** TEG: hot side on flue 200–300 °C destroys SP1848 (≈150 °C max) -> mount on a plate, keep under ~150 °C; 4–6 modules ≈ 5–15 W (not 24–60); quick fact 5–30W -> 5–15 W
- **FIX** wiring list rectifier "4 × 1N4007" -> 10 A diodes
- **FIX** quick stat "1500–3000 target RPM" -> depends on generator (150–1,500+)
- **FIX** quick ref: water wheel 1 m × 10 L/s "60–200 W" -> 40–80 W; pedal 50–150 -> 50–100; wind "1m blade" -> 1 m rotor; biogas 1 cow "2–3 h" -> about 1 h per cow
- **FIX** "water and wind intermittent, biogas continuous" -> wind/sun intermittent; water & biogas steady
- **FIX** steam test: hydraulic (water) test, never air; Watt 1769 -> worked once Wilkinson bored true cylinders (1776)
- **FIX** H2S filter: rusty iron (iron oxide)
- **Layout** Pelton ASCII -> micro-hydro figure (shared)
### Science
- **FIX** battery runtime 0.8 for lead-acid -> 0.5 (longer life), LiFePO4 0.8–0.9; example 100 Ah 40 W ≈ 15 h
- **FIX** "baking soda neutralises acid burns" -> acid spills; on skin flush with water only
- **FIX** wood to boil 5 L: say it assumes ~25% efficient fire
### Communications
- **FIX** prosign AR "· — · —" -> · — · — · (and check morse.js table)
- **FIX** CHIRP URL "chirp.danplabell.us" -> chirpmyradio.com (formerly chirp.danplanet.com)
- **FIX** "Technician exam open book" -> not open book (but question pool is public)
- **FIX** Meshtastic "8+ hop limit" -> up to 7 hops (default 3)
- **FIX** FRS/MURS: Baofengs aren't certified for FRS/MURS transmit — listen only
- **ADD** UK note: calling 145.500 MHz (2 m) / 433.500 (70 cm); UK licences Foundation/Intermediate/Full; PMR446 licence-free
- **IMG** crystal set pictorial (antenna, coil+slider, diode, earpiece, ground); signal mirror V-finger aim
### Navigation
- **FIX** triangulation "two landmarks -> line of intersection" -> a point; three -> small triangle
- **FIX** tree-ring spacing "Medium" -> unreliable (rings wider where the tree leans/reaction wood, not sun)
- **FIX** Orion's belt "at equinox" -> rises due east and sets due west on every night
- **ADD** watch method: in summer time (BST/DST) use 1 o'clock, not 12
- **ADD** UK declination: about 0–2° W and shrinking (2026) — check map legend
- **Layout** baseplate compass ASCII -> figure
- **IMG** baseplate compass parts ("red in the shed")
### Projects
- **FIX** bucket bio-sand: gravel on top of the sand contradicts the biolayer -> diffuser plate (holed lid) on top, standing water above sand; gravel only at bottom
- **FIX** "faecal-oral disease kills more than the disaster itself" -> can, in camps/long outages (Haiti 2010)
- **IMG** Corsi–Rosenthal cube (4 filters + fan on top, airflow arrows)
### Knowledge
- **FIX** timeline: fire (~1 million–400,000 BCE) placed before 300,000; Bronze Age collapse was the eastern Mediterranean (Hittites, Mycenae; Egypt weakened) — Indus faded ~1900 BCE, Akkad fell ~2150, Shang continued; "early Islam ~1–400 CE" remove (7th c.); "scientific method born 500 BCE" -> logic & geometry formalised; Gutenberg "1/300th" -> fell sharply; child mortality "falls 80%" -> more than halved since 1960
- **FIX** Story of Mankind "1921 Newbery winner" -> published 1921, first Newbery Medal 1922
- **FIX** reading list: Farming the Woods = Ken Mudge & Steve Gabriel; "How Things Work" dup -> The Way Things Work once; Emergency War Surgery free from the Borden Institute (not AMSUS)
- **FIX** media: DVD-R standard 10–25 y (archival gold 50–100); SSD unpowered 1–5+ y (power up yearly); HDD stored 5–10+ (spin up yearly)
- **IMG** storage lifespan bar chart (paper, M-DISC, DVD, USB, SSD, HDD)
### Governance
- **FIX** pencil/ballpoint contradiction with knowledge page -> graphite doesn't fade but smudges/erases; iron-gall or archival pigment ink for records; ballpoint lasts decades in the dark, fades in light; regular paper "5–30 years" -> yellows/brittle over decades
- **FIX** Iroquois "influenced US Constitution" -> often credited (debated)
### Psychology
- **FIX** decision fatigue "~200 decisions" and "glucose directly affects PFC" -> fixed decision budget is debated; tiredness, hunger and sleep loss clearly worsen judgment
- **FIX** CIWA bands -> 0–8 minimal, 9–15 moderate, 16+ severe (20+ very high risk); 10 items (nausea, tremor, sweats, anxiety, agitation, tactile, auditory, visual, headache 0–7; orientation 0–4)
- **FIX** PTSD "20–30% after severe trauma" -> roughly 1 in 10 to 1 in 3 depending on the event
### Textiles
- **FIX** sinew "waterproof when dry" -> softens/stretches when wet; protect joins with pitch or glue
- **FIX** hat "up to 30% of body heat through the head" -> about 10% (by area), more when it's the only bare part
- **FIX** milkweed "6× warmer than wool" / "150% of down" -> roughly as warm as down when dry (claims vary)
- **FIX** wool washing "cold ONLY / hot+agitation" vs scouring 60 °C -> scouring hot is fine without agitation; it's agitation + temperature shock that felts; wash garments lukewarm
- **FIX** brain-tan saying -> traditional saying, roughly true for deer; eggs work too
- **FIX** warp-weighted loom "nearly every European textile until 1200" -> much of northern European cloth until the treadle loom spread (11th–13th c.)
- **FIX** repair "200:1" -> about 120:1 (40 h vs 20 min); newspaper "20–30%" -> noticeably
- **IMG** six hand stitches + saddle stitch (replace ASCII); plain vs twill (replace ASCII)
### Medical
- **FIX** needle-decompression note "A three-sided chest seal alone will help" -> a vented seal, or a sealed one you burp (contradicts §12)
- **FIX** status epilepticus diazepam "5–10 mg rectal" -> 10 mg rectal for adults (0.5 mg/kg child, max 10–20) / 5–10 mg IV
- **FIX** wound packing "5+ minutes" -> at least 3 min with haemostatic gauze, 10 with plain gauze
- **Layout** START ASCII -> flowchart figure (include "breathes after airway repositioned -> RED")
- **IMG** START triage flowchart; pressure-immobilisation bandage (neurotoxic bites)
### Food
- **FIX** berries "white/yellow/red high risk; blue/black lower risk" -> colour is no guide (deadly nightshade berries are black)
- **FIX** cactus "saguaro and fishhook barrel among safer" -> most cactus juice causes vomiting; fishhook barrel is the one usually cited; don't rely on it
- **FIX** transpiration bag "0.5–1 L in several hours" -> about a cup a day per bag; dew "1–2 L/hour" -> up to ~1 L/hour in heavy dew
- **FIX** giant puffball "car-sized" -> up to beach-ball size; chicken of the woods: never from yew/conifers/eucalyptus hosts
- **ADD** snares: banned in Wales, restricted elsewhere (check law; survival only)
- **Layout** ASCII (filter, still, catchment, latrine, rotation, snare, deadfall) -> figures where they exist; remove duplicates
- **IMG** figure-four deadfall trigger + snare set; improvised still (pot, lid tube, cold-water condenser)
### Build-water
- **FIX** well candle test: a candle that goes out = deadly air, but one that stays lit does NOT prove safe (it burns down to ~16% O2; CO/CO2/H2S invisible; methane can ignite) -> ventilate before every entry, harness + surface team
- **FIX** swale spacing formula (contradicts itself) -> spacing by canopy/rainfall: ~5–10 m steep, 15–30 m gentle
- **FIX** first-flush quick ref 9.5 L/m -> 8.5 L/m (104 mm bore)
- **FIX** UK rainfall "650 mm avg" -> south-east England ~650; UK average ~1,150 (label)
- **FIX** frost depth 600 -> 750 mm (UK water regs)
### Chemistry
- **FIX** soap recipe "otherwise use all lard" with same 140 g NaOH = no superfat -> all-lard 1 kg: 130 g NaOH
- **ADD** ash lye is mostly potassium carbonate; boiling it with slaked lime makes stronger caustic potash
- **FIX** sunflower KOH 0.194 -> 0.188 (match NaOH 0.134)
- **FIX** quicklime "900 °C locally" -> several hundred °C — enough to boil water and start fires
- **FIX** "puering" (that's bating) -> weak tan liquor first
- **ADD** pot still: never a sealed system — remove pressure-cooker valve/weights; a blocked condenser builds pressure
- **FIX** nixtamalisation "5% lye or slaked lime" -> about 1% slaked lime by weight of corn (match Food page)
- **Layout** pot still, retort, oil lamp ASCII -> figures (retort fig exists)
- **IMG** pot still (open system: boiler, lyne arm, condenser in cold water, collection)
### Nbc
- **FIX** EMP "Highly vulnerable: all computers, smartphones, pacemakers, digital ham radios; E1 destroys microelectronics instantly" -> "At risk" — most damage expected in devices wired to long cables/grid; unplugged handhelds often survive; effects uncertain
- **FIX** H2S IDLH 50 ppm -> 100 ppm (NIOSH)
- **FIX** burial distance 50 m here vs 30 m Medical -> at least 30 m from water (further for many bodies; 250 m from drinking wells for mass graves) — make both match
- **ADD** ammonia: a big anhydrous release can hug the ground as a cold fog at first
- **Layout** KFM + Faraday trash-can ASCII -> figures
- **IMG** KFM electroscope (can, foil leaves, insulating thread, desiccant, window)
### Medicine-making
- **ADD** horsetail: short courses only (contains thiaminase); marsh horsetail (E. palustre) is toxic — confirm species
- **ADD** comfrey: up to ~10 days at a time, intact skin only (pyrrolizidine alkaloids)

---

## Power from scrap and the water-treatment chooser (November 2026)

- **How spinning makes electricity** (Power Generation, "How It Works"): a four-magnet rotor sweeps
  past a coil; a scope trace shows AC, or DC through a diode bridge; speed slider.
- **Generator matcher** (Energy, after the bicycle generator; Power Generation, under water-wheel
  coupling): drive (hand crank 20–50 W, pedal 50–100 W with the wheel at ~175 RPM, small engine
  ~3,000 RPM, overshot water wheel ~12 RPM) × salvaged generator (treadmill PM motor ~20 V per
  1,000 RPM, so 14 V at ~700; car alternator charging from ~1,500 RPM with a 25–50 W field;
  direct-drive washing-machine motor ~14 V at ~200 RPM; printer stepper, a few watts). Gives the
  ratio, roller or pulley sizes (two belt stages above 8:1), volts, watts into a 12 V battery, and
  what that runs. "Best ratio" searches for the most charge without over-speed. Washing-machine
  figures depend on rewiring — **⚑ check against a real conversion**.
- **Axial-flux wind alternator, exploded** (Energy, wind): hub, rear magnet rotor (12 magnets,
  alternating poles), stator (9 coils, 3 phases, in resin), front rotor (with the crushing-hazard
  warning), blades. After Hugh Piggott's published design; not to scale.
- **Car-alternator rig** (Salvage §8, `tools/altrig.py`): engine, big-to-small pulleys, alternator,
  fused B+ to battery, frame to negative, lamp-and-switch exciter, slotted mount; numbered 1–5 to
  match the steps.
- **Water-treatment chooser** (Food & Water, before Method 1): source, look, amount and what you
  have → a numbered plan using the page's own doses (boil 1 min / 3 above 2,000 m; bleach 2 drops/L
  of 5–6%, 1.5 of 8.25%, 10 of 1%, doubled for cloudy, 30 min or 60 cold/cloudy; iodine 1–2
  tablets/L; SODIS 6 h or two days, ≤ 2 L PET, clear only). Sea water and chemical sources go to
  distillation or "do not drink"; floodwater, Cryptosporidium and iodine-in-pregnancy warnings.

### Text corrections made while building these

| Page | Was | Now | Why |
|---|---|---|---|
| Energy — bicycle generator | car alternator "ideal" | PM DC (treadmill) motor best; alternator works poorly on muscle power | Field draws 25–50 W of a 50–100 W rider; needs 1,500+ RPM |
| Energy — gear ratio | cadence 60 RPM taken as wheel speed; 25:1, 26 mm roller | wheel ~175 RPM at 60–70 cadence; ~4:1 for a treadmill motor (165 mm roller), ~9:1 for an alternator | Bike gearing was ignored |
| Energy — wind power | P ≈ 0.3·D²·v³ | P ≈ 0.15·D²·v³ (0.3 = Betz ceiling) | 0.3 is the theoretical maximum; home-built rotors reach about half |
| Energy — human power | hand crank ~5 W sustained | 20–50 W two-handed | Matched Power Generation's figure; ~5 W is a small torch crank |
| Power Gen — water wheel | small pulley on the wheel, large on the motor; 100:1 example | large pulley on the wheel, small on the generator; choose a slow generator | The old layout slows the generator down |
| Power Gen — motors table | treadmill "generates at walking pace"; washing machine "universal… needs rectifier"; stepper as a real option | treadmill ~12–14 V at 600–700 RPM; universal motors don't self-generate, direct-drive PM ones are excellent; steppers give a few watts | Accuracy |
| Power Gen — blocking diode | 1N5408 (3 A) | 10 A diode or Schottky on a heat sink | Pedal output ~8 A burns out a 3 A diode |
| Power Gen — parts list | 50 A bridge "or 4 × 1N4007"; duplicate charge-controller row | 10 A diodes; duplicate removed | 1N4007 is a 1 A diode |
| Power Gen — wind tower | printer stepper "easiest option" | direct-drive washing-machine or treadmill motor; axial-flux best | A stepper makes a few watts |
| Vehicles — e-bike motor | starter motors "not permanent-magnet" | built for huge short bursts; many have field windings | Many modern starters do use magnets |
| Salvage — alternator rig | no switch in the exciter lamp wire | switch it off when the engine stops | Otherwise the field drains the battery |

---

## Exploded views, seasons wheel, constellation finder (November 2026)

- **Exploded views** (`data-calc="explode"`): rocket stove (Energy, after the build steps), hand-dug
  well (Water Systems, after the well steps) and biosand filter (Water Systems, after its build
  list). "Take it apart" slides the layers up; tapping a part reads out what it is and why, using
  the page's own numbers (feed tube ~15 × 30 cm; sealed lining top 3 m, open joints below; apron
  1.5 m; biosand 5 + 5 cm gravel, 10 cm coarse sand, 50 cm fine sand 0.15–0.35 mm, 5–10 cm
  standing water). Well not to scale; biosand heights to scale.
- **Seasons wheel** (Climate, above the foraging calendar; `tools/seasons_data.py`): one dial for the
  year. Forage rings and month notes come straight from the foraging wheel's data; Grow comes from
  the Agriculture planting calendar ('cold' zone, with a "milder area" switch for 'temperate');
  Store and Get-ready notes are new, written for UK conditions — **⚑ check for other climates**.
  Opens on the current month.
- **Constellation finder** (Navigation, after the star charts): 70 bright stars (J2000 places,
  precession ~0.3° ignored) turned to altitude/azimuth from the device clock, latitude (typed or GPS)
  and longitude (guessed from the time zone, or GPS). Stereographic view about 100° wide with the
  horizon, compass points, constellation lines, the pointer line to Polaris, the Summer Triangle and
  the south celestial pole. "Use phone compass" aims it with the phone's orientation sensors (iOS
  asks permission); otherwise drag, arrow keys or N/E/S/W/Overhead. Checked against known skies:
  London 22:00 UT 15 Nov (Capella ENE ~55°, Orion rising ESE, Big Dipper low in the north) and
  Sydney 21:00 local 15 May (Crux and the Pointers high SSE, south pole 34° up).
  **⚑ The compass mode needs testing on real iPhone and Android handsets.**

---

## Moon phase dial and water-flow calculator (November 2026)

- **Moon phase dial** (Navigation, after the star signposts): any night from a month back to two
  months ahead, worked out offline (mean synodic month from the new moon of 6 Jan 2000; within
  about a day). Shows the phase, % lit, how useful the light is, rough rise and set (sun time;
  rises about 50 minutes later each night), next full and new moon, a 30-night strip, and a
  northern/southern hemisphere switch.
- **Water flow from a raised tank** (Water Systems, under the head-pressure table): drag the
  height; 0.1 bar per metre as the page says. Flow follows the page's own table for 25 mm MDPE
  (Q ≈ 4·H^0.72 L/min matches its 1/3/5/10/20 m rows within ~10%), scaled to other bores by
  (bore/19 mm)^2.63; time to fill a bucket, jerrycan or barrel, and what the pressure is good for.

---

## Weather fronts and fire lays, animated (November 2026)

- **Weather fronts** (Climate › Predicting weather): a low-pressure system drifts west to east over
  a person on the ground: cirrus, cirrostratus with a halo, altostratus lowering, nimbostratus and
  steady rain at the warm front, the mild drizzly warm sector, then the cold front's cumulonimbus
  and heavy shower, and clearing colder air behind. Timings and wind/pressure notes follow the
  page (rain ~12–24 h after cirrus thickens; wind backs ahead, veers behind).
- **Fire lays** (Climate › UK Fire Starting): teepee, log cabin and lean-to, each built, lit on the
  windward side, catching through the kindling (air drawn in at the bottom) and fed with fuel.

---

## Plant-or-lookalike game, machines that run, living home sky (November 2026)

- **Plant or lookalike?** (Climate › Deadly lookalikes): flip cards made from the guide's own nine
  lookalike panels (wild garlic group, carrot family, chanterelles), copied into a template by
  `tools/lookalike_game.py`. The front shows only the plant; pick which one it is and the card turns
  to the full panel with its verdict and tells. Score, streak, and a "look again at" list.
- **Machines that run** (`machine()` in calc.js): a four-stroke engine (Vehicles: slider-crank
  piston, valves, spark, gas colours), bellows and forge (Metalworking: single chamber, flap valve,
  the fire flares on the push), a hand piston pump (Water Systems: foot valve and piston valve), and
  a hydraulic ram (Projects: drive flow, waste valve slam, delivery surge, air chamber). Run/Pause,
  speed, Next stage; stage tabs explain each part; pause off screen; start paused for reduced motion.
- **Living home sky**: the home title sits in a sky that follows the device clock, with twinkling
  stars, the sun by day, tonight's real moon phase (from the date, named by how much is lit) and a
  hillside shelter whose lantern glows after dark. A line under the subtitle says the moon phase.

---

## Living section badges (November 2026)

Every section's header badge now holds its own small looping scene instead of the static menu
icon (`BADGE` in app.js, `.bm-*` in style.css): a drop rippling (Food & Water), a heart beating with
a trace (Medical), a flame flickering (Energy), smoke from a chimney (Shelter), a compass needle
swinging and settling (Navigation), a shine across a shield (Security), a sprout growing
(Agriculture), paw prints (Animals), a hammer striking with sparks (Metalworking), a needle sewing
(Textiles), bubbles in a flask (Chemistry), turning gears (Projects), a turbine (Power), a dripping
tap (Water Systems), bricks stacking (Building), orbiting electrons (Science), a page turning
(Knowledge), scales tilting (Governance), a 4-4-4-4 breathing circle (Psychology), rain (Climate),
a tornado (Disasters), a turning trefoil (NBC), and more. All in the section colour; still for
reduced motion and in print.

---

## Knots that tie themselves, sun clock, Morse trainer (November 2026)

- **Watch it tie** (Knots): each knot player has a Steps / Watch it tie switch. A slider (or Play)
  lays the rope along its real path through the same keyframes as the steps; a crossing only
  covers once both passes have arrived, and the whipped end rides the tip. The drawing comes from
  the same checked geometry (`Knot.scrub` in tools/knots/rope.py). **Turn it over** (bowline, sheet
  bend, reef) flips to the knot seen from behind: mirrored with every over now under, built by
  `turned_over()` and passed through the same crossing checker. Not for knots drawn against a post
  or anchor, whose back is hidden.
- **Sun clock** (`data-calc="sun"`): Navigation (shadow stick from above, with the tip's path for
  the whole day) and Shelter (a window under an overhang at noon). Sun time; declination
  23.44°·sin(360/365·(day − 81)). London midsummer noon gives 62°, midwinter 15°.
- **Morse trainer** (Communications): type a message to hear it and see it flash in step
  (dot 1, dash 3, gaps 1/3/7 units, unit = 1.2 s ÷ wpm), Repeat, a full-screen lamp for
  signalling with a phone (keeps the screen awake), and a listen-and-decode game.

**Correction:** Shelter › Overhang Sizing gave depth = height × tan(90° − latitude − 23.5°), which
makes overhangs *smaller* further from the equator. The geometry for shading the whole window at
midsummer noon is depth = height × tan(latitude − 23.5°): 0.1× at 30°, 0.4× at 45°, 0.55× at 52°.
The "50–65% for 30–45°N" rule of thumb was removed.

---

## Emergency-first openings, phone tables, calculators, more step players (November 2026)

- **"If this is happening now" strip** under every section header (`setupNowStrip` in app.js):
  four big cards. Red ones open the emergency card; the rest jump to the right part of the page and
  flash it. Calm sections get "Start here" instead. The map of cards per page is `NOW` in app.js.
- **Tables become cards on phones** (`stackTables`): 3+ columns, no merged cells. Column names
  become labels. Wide screens and print are unchanged; `.no-stack` opts a table out.
- **Calculators** (`assets/js/calc.js`, loaded only where used), each beside the text it works from:
  fallout clock (NBC, 7-10 rule, R = R₁·t⁻¹·², with shelter protection factor), bleach dose (Food,
  EPA drops per gallon), rainwater yield (Food, area × rain × 0.623 × roof runoff; first flush
  10 gal per 1,000 sq ft), solar sizing (Energy, the page's three steps — 550 Wh/day gives the
  page's 275 Ah).
- **Four more step players** (`tools/players2.py`; the earlier ones now live in `tools/players.py`):
  adult CPR (compressions pump at 110 a minute while that step shows), choking (back blows, in-and-up
  thrusts), splinting a forearm, and making water safe (settle, filter, boil, store). Text follows
  the page beside each one.

⚑ **needs expert review:** the CPR, choking and splint drawings (a first-aid trainer).

---

## Text accuracy sweep — safety-critical pages (November 2026)

Read through Medical, Food & Water, Water Systems, Chemistry, NBC and Medicine Making. Fixed only
what is clearly wrong against current standard guidance (Resuscitation Council UK / ERC, WHO, USDA,
CDC/EPA, FDA, TCCC) or contradicted elsewhere in the guide. Emergency cards changed to match.

| Page | Was | Now |
|---|---|---|
| Medical | Tourniquet only after 5–10 min of direct pressure | Straight away for life-threatening limb bleeding |
| Medical | Irrigate 100–200 mL per cm of wound *depth* | 50–100 mL per cm of wound *length* |
| Medical, cards | Cool burns 10–20 min, "most benefit within 30 min" | 20 min; still helps up to 3 hours later |
| Medical | Newborn not breathing: adult-style 30 compressions : 2 breaths at 100/min | Breaths first (5, then ~40/min, head level); compressions only if still no sign of life, 3:1 — matches Pregnancy & Infant Care |
| Medical | Cord tied at 10 and 15 cm | Wait 1–3 min / until it stops pulsing; tie at about 2 and 5 cm (WHO) |
| Medical | Misoprostol 400–600 mcg under the tongue | 600 mcg by mouth to prevent; 800 mcg under the tongue to treat (WHO) |
| Medical | Ibuprofen 400–800 mg, no daily maximum | 400 mg; max 1,200 mg/day without advice (2,400 with) |
| Medical | Sucking chest wound: tape three sides | Vented seal, or an airtight seal you watch and “burp”; three-sided method no longer advised |
| Medical | Needle decompression "just above the 3rd rib (inserting below a rib avoids…)" | Over the top of the lower rib; 4th–5th space anterior axillary line now preferred, 2nd space mid-clavicular as alternative |
| Medical, cards | Snakebite: limb below heart level | At about heart level |
| Medical | "70% of snakebites" dry | A fifth to a half of bites are dry |
| Medical | Tetanus: flush punctures with hydrogen peroxide (contradicted the wound section) | Water, then diluted iodine |
| Medical, NBC | Lime "speeds" decomposition in graves | Reduces smell; does not speed decay |
| Medical | START triage branch "<6/min" | Removed (START uses >30/min only) |
| Food & Water | Latrine 60 m from water (contradicted its own diagram and Projects page) | 30 m (WHO/Sphere), further on sandy or rocky ground |
| Food & Water | Pressure canning "10 PSI, +1 per 2,000 ft" | Weighted gauge 10 PSI (15 above 1,000 ft); dial gauge 11 PSI +1 per 2,000 ft above 2,000 ft (USDA) |
| Food & Water | Dry cure "1 oz curing salt per 5 lb meat" (about 5× too much nitrite) | 1 level tsp Prague Powder #1 per 5 lb |
| Food & Water | Jerky 160°F poultry / 165°F game (swapped) | 160°F meat, 165°F poultry (USDA) |
| Food & Water | Trichinella called "pork tapeworm" | A parasitic roundworm |
| Food & Water | Nixtamalisation 1 Tbsp lime per cup of corn | About 1 Tbsp per 2 lb (1 kg) |
| Food & Water | Pine needle tea, no warnings | Not in pregnancy; never confuse with yew |
| Food & Water | Bleach table lumped 6% and 8.25% | Separate rows (8.25%: 6 drops/gallon) |
| Water Systems | Storage chlorination "0.5 mg/L … 1 mL per 10 L" and buckets 0.5 mL/10 L (two different doses) | One dose: 1 mL of 5% per 10 L (= 2 drops/L) |
| Water Systems | Well shock 250 mL bleach per 1,000 L (~12 mg/L) | About 1 L per 1,000 L (~50 mg/L) |
| Water Systems | SODIS "12 hours if cloudy" (Food page said 2 days) | Two days if more than half cloudy |
| Water Systems | Biosand "removes 99% of pathogens" | Most bacteria, almost all parasites, fewer viruses — still disinfect |
| Chemistry | Coconut oil NaOH SAP 0.190 | 0.183 (matches its own KOH value) |
| Chemistry | Corn mash with "1 cup malted barley" for 5 kg corn | Boil to gelatinise, then ~1 kg malt at 60–65°C |
| Chemistry | Antiseptic alcohol "must be above 70%" (Food page said 60%+) | 60–90%, about 70% best |
| Chemistry | Charcoal for poisoning 50–100 g | 50 g adult, 1 g/kg child — matches Medical |
| Chemistry | Charcoal needs 2–3× coal "by weight" | Similar heat by weight; 2–3× by volume |
| Chemistry | Tin + spirit makes "organotin compounds" | Acidic liquids dissolve tin, solder and zinc; use glass |
| NBC | KI "up to 4 hours after"; reactor box "within 24 hours" | Best within 24 h before to 2 h after; some benefit to ~8 h (FDA/WHO) |
| NBC | Sealed food safe because "radiation does not penetrate" | Radiation passing through does not make food radioactive; wipe off fallout dust |
| NBC | Carrington repeat "would destroy most of the grid"; all modern cars disabled by EMP | Could damage many transformers; in US tests most cars kept running or restarted |
| NBC | Smallpox rash "face, palms and soles simultaneously"; "no treatment", VIG | Starts in mouth and face, spreads out; tecovirimat stockpiled; vaccine within 3–4 days |
| NBC | Pralidoxime "within minutes for sarin" | Before ageing: ~2 min for soman, hours for sarin |
| NBC | Cyanide: "amyl nitrite (poppers)" | Amyl nitrite from a cyanide antidote kit |
| Medicine Making | "Do not use tap water on wounds" (contradicted Medical) | Drinkable tap water is as good as saline |
| Medicine Making | "No iodine in wounds" (contradicted Medical) | Only well diluted, about 1:10 |
| Medicine Making | Quick card: ">41.5°C cold immersion" beside "never cold" | Above 41.5°C is usually heat stroke, where cold immersion is right |
| Medicine Making | Comfrey vs foxglove, wild garlic vs lords-and-ladies tells were wrong | Rough bristly leaves with winged stems vs soft downy rosette; arrow-shaped net-veined leaves; autumn crocus added |
| Agriculture | Ribbon test: 1–2 in ribbon = loam | Under 1 in = loams; 1–2 in = clay loams; over 2 in = clays (USDA ribbon method) |

⚑ Still for a clinician: everything on the Medical page (it says so at the top); the chest-seal and
needle-decompression changes especially.

---

## Redrawn diagrams, fourth batch (`tools/redraw4.py`)

This finishes the redraws. Left as they are on purpose: the illustrated plant cards, the two
decorative scenes, the interactive foraging wheel, the compass rose, the box-breathing widget, and
the heat and temper colour charts (their colours are the information).

| Section | New `id` | What changed besides the look |
|---|---|---|
| Agriculture | `fig-soiltri` | **Now the real USDA triangle**: all 12 soil classes drawn from their published boundaries (it was a sketch with 5 rough zones), with a worked jar-test example |
| Agriculture | `fig-rotation` | The cycle plus the four staggered beds as a grid |
| Agriculture | `fig-companion` | Cards instead of a wheel; same pairs, plus the three sisters |
| Agriculture | `fig-swale-ag` | Same drawing as Water Systems (`fig-swale`) |
| Agriculture | `fig-aquaponics` | System and nitrogen cycle as two panels |
| Building | `fig-perimeter` | The drawing's "50–100 m" appears nowhere in the text; it now uses the text's 100–200 m for the outer line |
| Energy | `fig-solar` | Positive and negative wires and every fuse shown. **Modified-sine note corrected**: the old label said modified sine is "OK for motors/tools"; motors run hotter on it and some electronics and chargers fail |
| Navigation | `fig-sky-north`, `fig-sky-south` | **Plotted from real star positions**, and **the sky turns** (anticlockwise round Polaris, clockwise round the south pole; one turn per 2 minutes; labels stay upright; pauses on hover; off for reduced motion and in print). **Orion removed from the north-facing chart**: northern observers see it in the south. Capella and Deneb added. The 4.5× Crux rule checks out on the real positions |
| Navigation | `fig-sky-signposts` | Replaces an "all-sky winter" chart that also showed Vega and Arcturus (not winter-evening stars). Now two seasonal signposts: arc to Arcturus (spring) and Orion's belt to Sirius (winter) |
| NBC | `fig-blast` | Effect distances as bars to scale, and the 1 Mt zones as quarter rings |
| Psychology | `fig-deescalate` | Same steps as a ladder |
| Security | `fig-bugout` | Same four questions, in order |
| Textiles | `fig-tunic` | Layout and sewn-up view |
| Textiles | `fig-sashiko` | **The wave pattern is now real seikaiha** (overlapping arcs); it was drawn as wavy lines |
| Vehicles | `fig-cargobike` | **Contradiction removed**: the drawing gave the rear rack "max 50 lb" but each pannier "40 lb" (panniers hang on the rack). Now the rack rating covers the panniers, with typical figures and a reminder to check the stamped rating |

⚑ **needs expert review:** `fig-blast` (zone pressures for a 1 Mt airburst, kept from the page),
`fig-aquaponics` (1 fish per 40 L stocking).

---

## Redrawn diagrams, third batch (`tools/redraw3.py`)

| Section | New `id` | What changed besides the look |
|---|---|---|
| Building | `fig-aframe-house` | End view with ridge beam, purlins and collar tie. **Caption fixed:** it said trusses at 1.2 m centres while the drawing said rafters every 600 mm; both now say 600 mm. The floor beam is shown tying the rafter feet, which is what stops them spreading (a tie high up does much less) |
| Building | `fig-earthbag` | Half cut away: bags, barbed wire on every course, courses stepping in, rubble trench, plaster, door frame, centre-pin string |
| Chemistry | `fig-retort` | Barrel inside the fire box, with the gas pipe led back into the fire (the "closed loop" the text describes); completion signs and the never-open-hot warning |
| Metalworking | `fig-drumforge` | **Tuyere size fixed: 2–3 cm → 4–6 cm**, matching the build steps beside it. Grate, ash dump 2 cm below it, hip height ≈ 90 cm |
| Metalworking | `fig-knife` | Five stages with what happens at each, and three edge bevels (15°, 20–25°, 30° per side) drawn at their real angles |
| Metalworking | `fig-nail` | Six steps in panels (3 across, 2 on a phone), following the text: point, mark, nick, header, head, release |
| Textiles | `fig-spindle` | Spindle parts plus a Z/S twist panel showing which way the fibres slant |
| Textiles | `fig-loom` | Warp, weft, shed stick, shuttle and woven plain weave; terms beside it. Beating shown downward onto the woven cloth |
| Textiles | `fig-moccasin` | Pattern plus the sewn-up shoe |
| Food & Water | `fig-rainwater` | First-flush pipe with its floating ball and slow-drip cap. The flush volume is now given with the usual rule of thumb (about 10 gal per 1,000 sq ft of roof) rather than a flat 10 gal |
| Vehicles | `fig-dugout` | Plan and cross-section. **Two errors fixed:** the text called the crossbeams "amas" (the ama is the float; the crossbeams are iako), and said 18–24 in crossbeams hold the float 3–4 ft out, which cannot work. It now says the crossbeams must be long enough to hold the float 3–4 ft out |
| Vehicles | `fig-skiff` | Plan and side view; frames every 18 in, thwarts at thirds. **Text fixed:** "4×12 ft" plywood sheets → standard 4×8 ft sheets joined end to end |
| Agriculture | `fig-tbh` | End and side views drawn to the page's own dimensions. **The "120°" wall angle was dropped:** it did not match the drawing's own numbers (top 38–40 cm, bottom 24–28 cm, depth 25–30 cm give walls about 15° off vertical) |

⚑ **needs expert review:** `fig-earthbag` — earthbag domes are usually built pointed (taller than
half the width); a 4 m dome only 2 m high, as the page says, is a hemisphere, which is harder to
corbel. `fig-tbh` — 38 mm bars as the page says; many beekeepers use about 32–35 mm for brood comb.
`fig-rainwater` — first-flush volume.

---

## Corrections made while checking

| Where | Was | Now | Why |
|---|---|---|---|
| Water Systems — first flush | "110 mm pipe, 1.05 m holds exactly 10 L"; 75 mm pipe 1.13 m = 5 L | ≈1.2 m of 110 mm soil pipe (≈104 mm bore) for 10 L; 0.6 m for 5 L; 75 mm pipe ≈1.35 m | Pipe sizes are outside diameters; volume comes from the bore |
| Water Systems — first flush rule | 1 L per 10 m² | "at least" 1 L per 10 m², more for dirty roofs; notes many guides recommend ~0.2–0.5 L/m² | Published guidance is generally several times higher — **⚑ check against a current rainwater-harvesting standard** |
| Power Generation — pedal generator | LM7812 regulator "clamps output to 12 V"; rectifier "converts AC to DC" | Charge controller (PWM/MPPT) rated above motor voltage; rectifier only if the motor can reverse | 12 V cannot charge a 12 V battery; LM7812 ≈1.5 A max and ~35 V input limit; a treadmill motor is already DC |
| Vehicles — bicycle generator | motor "AC output", LM7812, "12 V battery charging direct", car starter motor | PM DC motor, blocking diode, charge controller, no direct charging | Same as above; starter motors are not permanent-magnet |
| Shelter — debris hut | "ridgepole 2–3 m longer than your height" | "about 1½ times your height (≈2.5–3 m)" | Standard guidance |
| Knowledge — storage | "every 10 °C reduction doubles the life of paper" | "every 5 °C (10 °F) cooler roughly doubles" | Conservation rule of thumb |
| Agriculture — A-frame | "calibrate on level ground" (circular) | swap the feet end-for-end; level is halfway between the marks | Standard self-calibrating method |
| Vehicles — chain check | "12 links = 12 in" (ambiguous) | "12 full links (24 pins, centre to centre)" | Bicycle chain pitch is ½" |
| Power Generation — wind blade | curved face "high pressure", flat back "low pressure"; "rotating about a vertical axis"; twist 30° → 15° | curved = low-pressure (suction) side; horizontal-axis rotor; twist ≈25° at root to a few degrees at tip | Aerofoil physics; typical small-turbine blade design — **⚑ check twist figures for your blade design** |
| Agriculture — crop rotation diagram | Leaves → Legumes → Roots → Fruits ("legumes precede heavy feeders" but were followed by roots) | Legumes → Leaves → Fruits → Roots | Matches the section's own rule: leaves use the nitrogen legumes leave |
| Climate — wild garlic | broad heart-shaped leaf with branching veins | long, pointed leaves with lengthwise veins; note that heart/arrow leaves = lords-and-ladies | Heart-shaped leaves belong to the toxic lookalike (*Arum*) |
| Climate — hemlock water dropwort | "purple-blotched stem — the key danger sign" | hollow grooved stem, parsley scent, "dead man's fingers" tubers, yellow-orange sap; purple blotches noted as *poison hemlock* (*Conium*) | Purple blotches identify a different deadly species — **⚑ botanist** |
| Metallurgy — heat colours | "Black red 400 °F / 200 °C" | "Faint red ~900–1,000 °F / 480–540 °C, only visible in shade" | Steel shows no glow at 200 °C (that is the tempering-colour range) |
| NBC — blast radii | 1 Mt: fireball 2.2 mi, 5 psi 8.5 mi, thermal 35 mi (and inconsistent scaling between yields) | 1 Mt airburst: fireball ~0.6 mi, 5 psi ~4.6 mi, 3rd-degree burns ~7 mi; 100 kt / 10 kt / 1 kt scaled by the cube-root rule; rings redrawn to scale; airburst vs ground-burst fallout note | Glasstone & Dolan scaling; NUKEMAP — **⚑ check against an effects calculator** |
| Governance — Dunbar | bars drew 150 and 500 at the same length | concentric layers | Misleading proportions |

---

## Existing diagrams reviewed (no change needed)

Checked by rendering each and reading its labels against the section text:

- **Agriculture**: soil texture triangle (schematic), companion planting wheel (matches matrix), swale cross-section, top-bar hive (38 mm bars), aquaponics nitrogen cycle (ammonia → nitrite → nitrate).
- **Power**: pedal-generator schematic (includes charge controller), water-wheel comparison (overshot ~85 %, undershot ~25–35 %, Pelton ~85 %+), biogas digester.
- **Building**: timber A-frame, cob wall (DPC ≥ 30 cm, 60 cm overhang), earthbag dome, defensive perimeter plan.
- **Water**: gravity distribution, hand-dug well (1.2 m bore, 3 m sanitary seal), swale irrigation.
- **Chemistry**: retort charcoal kiln.
- **Climate**: foraging wheel, nettle, blackberry, elder, rosehip, dandelion, chanterelle (true ridges vs false chanterelle gills).
- **Energy / Food**: solar system schematic (fused), rainwater catchment, VIP latrine (pit ≥ 1.5 m above water table).
- **Governance / Psychology / Security**: conflict-resolution and decision flowcharts, box breathing, de-escalation.
- **Medicine making**: tincture 1:5 method, fever thresholds.
- **Metallurgy**: JABOD forge, brake-drum forge, bellows, tempering colours (pale yellow 430 °F … blue 560 °F), knife sequence (20–25° per side), nail making.
- **Navigation**: northern sky (Polaris altitude = latitude), southern sky (Crux × 4.5), compass rose, star chart.
- **NBC**: fallout-shelter cross-section, decontamination flow (1:10 bleach for surfaces; soap and water for skin).
- **Textiles**: drop spindle (Z = clockwise), frame loom terms, tunic layout, moccasin pattern, welted boot (resoleable), sashiko.
- **Vehicles**: cargo bike, four-stroke cycle, Imbert gasifier zones, biodiesel processor (≈55 °C, below methanol's boiling point), dugout canoe, skiff.
