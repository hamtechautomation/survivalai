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
- Chemistry › The Cuts says methanol "concentrates first" and is "produced early in every
  distillation run". Methanol comes from fermentation, not distillation, and in a pot still it
  comes through across the whole run (with more in the tails), not only in the foreshots.
  Discarding foreshots is still sensible, but the text overstates what it achieves. **Not
  diagrammed until a chemist reviews the text.**

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
