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
