/* skills-data.js — All skill definitions for The Last Light Survival Guide */
'use strict';

const SKILLS_CATEGORIES = [
  { id: 'all',          label: 'All Skills'        },
  { id: 'fire',         label: 'Fire'              },
  { id: 'knots',        label: 'Knots'             },
  { id: 'navigation',   label: 'Navigation'        },
  { id: 'first-aid',    label: 'First Aid'         },
  { id: 'hunting',      label: 'Hunting & Fishing' },
  { id: 'plants',       label: 'Plant ID'          },
  { id: 'construction', label: 'Construction'      },
];

// SVG helpers — compact schematic diagrams
const SVG = {
  teepee: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><circle cx="100" cy="78" r="12" stroke-width="2"/><line x1="100" y1="66" x2="100" y2="18" stroke-width="3.5"/><line x1="109" y1="71" x2="148" y2="36" stroke-width="3.5"/><line x1="112" y1="78" x2="165" y2="78" stroke-width="3.5"/><line x1="109" y1="85" x2="148" y2="120" stroke-width="3.5"/><line x1="100" y1="90" x2="100" y2="138" stroke-width="3.5"/><line x1="91" y1="85" x2="52" y2="120" stroke-width="3.5"/><line x1="88" y1="78" x2="35" y2="78" stroke-width="3.5"/><line x1="91" y1="71" x2="52" y2="36" stroke-width="3.5"/><circle cx="100" cy="78" r="52" stroke-width="1.5" stroke-dasharray="5,3" opacity=".6"/></g><text x="100" y="156" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">TEEPEE — top view · light at base</text></svg>`,

  logcabin: `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><rect x="15" y="50" width="190" height="20" rx="10" stroke-width="4.5"/><rect x="15" y="90" width="190" height="20" rx="10" stroke-width="4.5"/><rect x="65" y="35" width="20" height="90" rx="10" stroke-width="4.5"/><rect x="135" y="35" width="20" height="90" rx="10" stroke-width="4.5"/><rect x="85" y="62" width="50" height="36" rx="4" stroke-width="1.5" stroke-dasharray="3,2" fill="rgba(201,169,78,0.12)"/></g><text x="110" y="18" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">LOG CABIN — top view</text><text x="110" y="152" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">tinder in gap · light from below</text></svg>`,

  starlay: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><line x1="100" y1="75" x2="100" y2="8" stroke-width="5.5"/><line x1="100" y1="75" x2="168" y2="113" stroke-width="5.5"/><line x1="100" y1="75" x2="32" y2="113" stroke-width="5.5"/><line x1="100" y1="75" x2="163" y2="38" stroke-width="5.5"/><line x1="100" y1="75" x2="37" y2="38" stroke-width="5.5"/><circle cx="100" cy="75" r="20" stroke-width="2" fill="rgba(201,169,78,0.18)"/></g><text x="100" y="148" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">STAR LAY — push logs in as they burn</text></svg>`,

  longfire: `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><rect x="10" y="18" width="240" height="22" rx="11" stroke-width="4.5"/><rect x="10" y="60" width="240" height="22" rx="11" stroke-width="4.5"/><path d="M70,50 Q82,36 94,50 Q106,36 118,50 Q130,36 142,50 Q154,36 166,50 Q178,36 190,50" stroke-width="1.8" opacity=".8"/></g><text x="130" y="95" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">LONG FIRE — 40cm gap · sleep alongside</text></svg>`,

  dakotahole: `<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><rect x="0" y="28" width="240" height="8" fill="rgba(201,169,78,0.15)" stroke-width="0"/><ellipse cx="75" cy="32" rx="40" ry="11" stroke-width="2"/><ellipse cx="165" cy="32" rx="28" ry="8" stroke-width="2"/><path d="M35,32 L35,100 Q75,118 115,100 L115,32" stroke-width="2"/><path d="M137,32 L137,90 Q165,104 193,90 L193,32" stroke-width="2"/><path d="M115,95 Q128,112 137,86" stroke-width="2" stroke-dasharray="4,2"/></g><text x="75" y="125" text-anchor="middle" font-size="8" fill="currentColor" font-family="monospace">fire hole</text><text x="165" y="115" text-anchor="middle" font-size="8" fill="currentColor" font-family="monospace">air hole</text><text x="120" y="138" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">DAKOTA HOLE — cross-section</text></svg>`,

  bowdrill: `<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><rect x="25" y="116" width="210" height="14" rx="5" stroke-width="2.5"/><line x1="100" y1="38" x2="100" y2="116" stroke-width="4.5"/><ellipse cx="100" cy="118" rx="12" ry="4" stroke-width="1.5"/><path d="M18,72 Q130,28 242,52" stroke-width="2.5"/><line x1="18" y1="72" x2="18" y2="52" stroke-width="1.5"/><line x1="242" y1="52" x2="242" y2="72" stroke-width="1.5"/><rect x="82" y="26" width="36" height="16" rx="6" stroke-width="2" fill="rgba(201,169,78,0.12)"/><circle cx="100" cy="116" r="6" stroke-width="2" fill="rgba(201,169,78,0.2)"/></g><text x="100" y="22" text-anchor="middle" font-size="7.5" fill="currentColor" font-family="monospace">handhold</text><text x="175" y="42" text-anchor="middle" font-size="7.5" fill="currentColor" font-family="monospace">← bow →</text><text x="155" y="118" text-anchor="middle" font-size="7.5" fill="currentColor" font-family="monospace">fireboard + V-notch</text><text x="130" y="145" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">BOW DRILL — full smooth strokes</text></svg>`,

  compass: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><circle cx="100" cy="100" r="82" stroke-width="2"/><circle cx="100" cy="100" r="66" stroke-width="1" stroke-dasharray="3,3" opacity=".5"/><circle cx="100" cy="100" r="10" stroke-width="2"/><line x1="100" y1="34" x2="100" y2="10" stroke-width="1.5"/><line x1="100" y1="166" x2="100" y2="190" stroke-width="1.5"/><line x1="10" y1="100" x2="34" y2="100" stroke-width="1.5"/><line x1="166" y1="100" x2="190" y2="100" stroke-width="1.5"/><polygon points="100,38 94,72 106,72" fill="currentColor"/><polygon points="100,162 94,128 106,128" fill="currentColor" opacity=".3"/><line x1="100" y1="100" x2="138" y2="66" stroke-width="2.5" stroke-linecap="round"/></g><text x="100" y="17" text-anchor="middle" font-size="11" fill="currentColor" font-family="monospace" font-weight="bold">N</text><text x="100" y="198" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">S</text><text x="7" y="104" font-size="9" fill="currentColor" font-family="monospace">W</text><text x="188" y="104" font-size="9" fill="currentColor" font-family="monospace">E</text></svg>`,

  shadowstick: `<svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><line x1="100" y1="120" x2="100" y2="40" stroke-width="3.5"/><circle cx="100" cy="120" r="4" fill="currentColor"/><line x1="100" y1="40" x2="44" y2="115" stroke-width="2" stroke-dasharray="4,3"/><circle cx="44" cy="115" r="5" stroke-width="2.5"/><text x="34" y="112" text-anchor="middle" font-size="8" fill="currentColor" font-family="monospace">1st</text><line x1="100" y1="40" x2="172" y2="110" stroke-width="2" stroke-dasharray="4,3" opacity=".7"/><circle cx="172" cy="110" r="5" stroke-width="2.5" opacity=".7"/><text x="184" y="107" font-size="8" fill="currentColor" font-family="monospace">2nd</text><line x1="44" y1="115" x2="172" y2="110" stroke-width="2.5"/><text x="42" y="135" font-size="9" fill="currentColor" font-family="monospace">W</text><text x="175" y="128" font-size="9" fill="currentColor" font-family="monospace">E</text></g><text x="140" y="155" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">SHADOW STICK — first mark=W, second=E</text></svg>`,

  stars: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><circle cx="30" cy="80" r="3"/><circle cx="60" cy="50" r="3"/><circle cx="95" cy="40" r="3"/><circle cx="125" cy="55" r="3"/><circle cx="100" cy="80" r="3"/><circle cx="195" cy="18" r="5" opacity=".9"/><line x1="30" y1="80" x2="60" y2="50" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="60" y1="50" x2="95" y2="40" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="95" y1="40" x2="125" y2="55" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="125" y1="55" x2="100" y2="80" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="100" y1="80" x2="30" y2="80" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="95" y1="40" x2="195" y2="18" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5,3" fill="none" opacity=".7"/><line x1="125" y1="55" x2="195" y2="18" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5,3" fill="none" opacity=".7"/></g><text x="195" y="14" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">POLARIS</text><text x="68" y="98" font-size="8" fill="currentColor" font-family="monospace">THE PLOUGH</text><text x="120" y="170" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">pointer stars → extend 5× = Polaris</text></svg>`,

  cpr: `<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><ellipse cx="110" cy="90" rx="55" ry="70" stroke-width="2" fill="rgba(201,169,78,0.06)"/><ellipse cx="110" cy="55" rx="22" ry="28" stroke-width="2"/><rect x="75" y="85" width="70" height="12" rx="3" stroke-width="2" fill="rgba(201,169,78,0.15)"/><line x1="80" y1="155" x2="95" y2="160" stroke-width="3"/><line x1="140" y1="155" x2="125" y2="160" stroke-width="3"/><rect x="82" y="91" width="56" height="6" rx="2" fill="currentColor" opacity=".4"/><text x="110" y="93" text-anchor="middle" font-size="7" fill="currentColor" font-family="monospace">↓ 5–6cm</text></g><text x="110" y="175" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">CPR — heel of hand, centre chest</text></svg>`,

  tourniquet: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><rect x="75" y="20" width="50" height="150" rx="25" stroke-width="2" fill="rgba(201,169,78,0.06)"/><rect x="62" y="55" width="76" height="16" rx="3" stroke-width="2.5" fill="rgba(200,72,72,0.2)" stroke="#c84848"/><line x1="138" y1="63" x2="160" y2="63" stroke-width="2"/><rect x="158" y="56" width="14" height="14" rx="3" stroke-width="2"/><line x1="164" y1="56" x2="164" y2="48" stroke-width="2"/><text x="164" y="44" text-anchor="middle" font-size="7.5" fill="currentColor" font-family="monospace">windlass</text><text x="170" y="68" font-size="8" fill="currentColor" font-family="monospace" fill="#c84848">5–7cm</text><text x="170" y="80" font-size="8" fill="currentColor" font-family="monospace" fill="#c84848">above</text><line x1="62" y1="71" x2="46" y2="71" stroke-width="1.5" stroke-dasharray="2,2"/><text x="44" y="68" text-anchor="end" font-size="7" fill="currentColor" font-family="monospace">wound</text></g><text x="100" y="175" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">TOURNIQUET — note time applied</text></svg>`,

  snare: `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none" stroke-linecap="round"><line x1="10" y1="80" x2="230" y2="80" stroke-width="1.5" stroke-dasharray="4,4" opacity=".5"/><line x1="120" y1="80" x2="120" y2="20" stroke-width="2"/><circle cx="120" cy="50" r="22" stroke-width="2.5"/><line x1="120" y1="28" x2="120" y2="20" stroke-width="2"/><line x1="120" y1="20" x2="80" y2="18" stroke-width="2"/><rect x="60" y="14" width="20" height="8" rx="2" stroke-width="1.5" fill="rgba(201,169,78,0.15)"/><line x1="108" y1="80" x2="108" y2="72" stroke-width="1.5" stroke-dasharray="2,2"/><line x1="132" y1="80" x2="132" y2="72" stroke-width="1.5" stroke-dasharray="2,2"/></g><text x="120" y="100" text-anchor="middle" font-size="8" fill="currentColor" font-family="monospace">loop 10cm dia (rabbit)</text><text x="120" y="115" text-anchor="middle" font-size="8" fill="currentColor" font-family="monospace">fist-height above ground</text><text x="120" y="152" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">SNARE — position on active run</text></svg>`,

  edibilitytest: `<svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="10" y="8" width="240" height="24" rx="6" stroke-width="1.5" fill="rgba(201,169,78,0.08)"/><rect x="10" y="40" width="240" height="24" rx="6" stroke-width="1.5" fill="rgba(201,169,78,0.06)"/><rect x="10" y="72" width="240" height="24" rx="6" stroke-width="1.5"/><rect x="10" y="104" width="240" height="24" rx="6" stroke-width="1.5"/><rect x="10" y="136" width="240" height="24" rx="6" stroke-width="1.5"/></g><text x="20" y="25" font-size="8.5" fill="currentColor" font-family="monospace">1. Smell — acrid or unpleasant → discard</text><text x="20" y="57" font-size="8.5" fill="currentColor" font-family="monospace">2. Skin contact — 8 hours, watch for reaction</text><text x="20" y="89" font-size="8.5" fill="currentColor" font-family="monospace">3. Lip contact — 3 minutes</text><text x="20" y="121" font-size="8.5" fill="currentColor" font-family="monospace">4. Swallow small amount — wait 8 hours</text><text x="20" y="153" font-size="8.5" fill="currentColor" font-family="monospace">5. Eating portion — wait 24 hours</text><text x="130" y="175" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">DOES NOT WORK FOR MUSHROOMS</text></svg>`,

  masonry: `<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="10" y="100" width="100" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.1)"/><rect x="115" y="100" width="100" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.1)"/><rect x="60" y="78" width="100" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.12)"/><rect x="10" y="78" width="48" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.12)"/><rect x="162" y="78" width="48" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.12)"/><rect x="10" y="56" width="100" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.1)"/><rect x="115" y="56" width="100" height="20" rx="2" stroke-width="2" fill="rgba(201,169,78,0.1)"/><line x1="220" y1="56" x2="220" y2="120" stroke-width="1.5" stroke-dasharray="3,2"/><line x1="226" y1="56" x2="226" y2="120" stroke-width="1.5" stroke-dasharray="3,2"/></g><text x="120" y="135" text-anchor="middle" font-size="9" fill="currentColor" font-family="monospace">RUNNING BOND — stagger joints · check plumb</text></svg>`,
};

// Generic SVG fallback by category
const CAT_SVG = {
  fire:         `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🔥</text></svg>`,
  knots:        `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🪢</text></svg>`,
  navigation:   `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🧭</text></svg>`,
  'first-aid':  `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🩺</text></svg>`,
  hunting:      `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🎣</text></svg>`,
  plants:       `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🌿</text></svg>`,
  construction: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><text y="80" font-size="80" text-anchor="middle" x="50">🪓</text></svg>`,
};

const SKILLS = [

  // ── FIRE ────────────────────────────────────────────────────────────────────

  {
    id: '1.1', category: 'fire', icon: '🔥',
    title: 'Fire Lay Types',
    difficulty: 'beginner',
    learnTime: '1 hr practice',
    teachTime: '30 min demo + 1 hr supervised',
    desc: 'Five essential fire configurations. Each has a different purpose — learn all five so you always have the right tool.',
    materials: ['Dry tinder (grass, leaf litter, bark dust)', 'Kindling (pencil-thickness sticks)', 'Fuel wood (thumb to wrist thickness)', 'Ignition source'],
    steps: [
      {
        title: 'Teepee Lay',
        body: 'Place tinder bundle in centre. Lean small kindling sticks inward over the tinder forming a cone. Add progressively thicker sticks around the outside. Light at the base — the flame travels upward through the centre naturally.',
        svg: SVG.teepee,
        tip: 'Best for: fast ignition, starting other lays. Common mistake: packing too tight (kills airflow) or too loose (collapses before lighting).',
      },
      {
        title: 'Log Cabin Lay',
        body: 'Place two large logs parallel with a gap between. Add tinder and kindling in the gap. Lay two more logs perpendicular across the first pair. Continue building upward like a log cabin wall. Light from below.',
        svg: SVG.logcabin,
        tip: 'Best for: sustained cooking heat. The structure collapses inward as it burns, feeding itself.',
      },
      {
        title: 'Star Lay',
        body: 'Build a small teepee to start the fire. Lay 4–6 large logs radiating outward from the centre like wheel spokes. Feed logs inward as they burn from the ends.',
        svg: SVG.starlay,
        tip: 'Best for: minimal wood, all-night heat. Ideal when you cannot collect much fuel — the fire manages itself.',
      },
      {
        title: 'Long Fire',
        body: 'Place two parallel logs roughly 40 cm apart and up to 2 m long. Fill the gap with kindling and fuel. Light both ends simultaneously for even burning along the full length.',
        svg: SVG.longfire,
        tip: 'Best for: sleeping alongside, heating a lean-to lengthways. The flat bed of coals is excellent for cooking.',
      },
      {
        title: 'Dakota Hole',
        body: 'Dig two holes 30 cm apart and 30 cm deep. Connect them with an angled tunnel at the base. Build fire in the main hole — air is drawn through the second hole and up through the tunnel, creating a powerful forced draft with minimal visible flame.',
        svg: SVG.dakotahole,
        warning: 'Sides can collapse. Line with stones if soil is soft.',
        tip: 'Best for: windy conditions, low smoke, stealth cooking. The subsurface draft makes it one of the most efficient fire structures.',
      },
    ],
    instructorNotes: {
      mistake: 'Students almost always pack the teepee too dense. Show them — poke a stick into the base and check for airflow before lighting.',
      fastTrack: 'Build a teepee first (fast feedback), then log cabin (slower reward). Once both work reliably, teach the others.',
      adaptations: 'Young children can gather kindling and sort by size — this is useful and teaches them wood selection without handling fire.',
    },
    competencyTest: 'Student builds any two lay types correctly from memory and explains when they would use each.',
  },

  {
    id: '1.2', category: 'fire', icon: '🔥',
    title: 'Bow Drill Fire Starting',
    difficulty: 'intermediate',
    learnTime: '10–20 hrs practice',
    teachTime: '2 hrs demo + ongoing supervised practice',
    desc: 'Friction fire using a bow and spindle. The most reliable primitive method. Requires correct materials and technique — both must be right.',
    materials: ['Fireboard — dry softwood (willow, hazel, lime, clematis)', 'Spindle — same wood, 30 cm, as straight as a pencil', 'Bow — curved stick ~60 cm, any wood', 'Bowstring — paracord, shoelace, or twisted bark cordage', 'Handhold — hardwood block or stone with a socket depression', 'Catchboard — thin bark or flat piece under the notch', 'Tinder bundle — bone-dry grass, cattail fluff, or birch bark dust'],
    steps: [
      {
        title: 'Prepare the Fireboard',
        body: 'Carve a thumb-sized depression 2–3 cm from the edge of the fireboard. Cut a V-notch from the edge to just past the centre of the depression. Place the catchboard under the notch to collect the ember.',
        svg: SVG.bowdrill,
        tip: 'The notch angle matters: too narrow and it packs with dust, too wide and the ember falls apart. One-eighth of the circle is the target.',
      },
      {
        title: 'String the Bow',
        body: 'Wrap the bowstring once around the spindle. Tension should be tight enough to grip the spindle without slipping, but loose enough that the spindle can be inserted without forcing.',
        svg: SVG.bowdrill,
      },
      {
        title: 'Body Position',
        body: 'Kneel with your left foot flat on the fireboard, pinning it to the ground. Lock your left wrist against your left shin — this is critical. Your body weight pressing down through the handhold must be consistent throughout the drill.',
        svg: SVG.bowdrill,
        tip: 'The wrist-against-shin lock is everything. Without it, you wobble and lose pressure. Practise this position before adding the bow.',
      },
      {
        title: 'Drilling Motion',
        body: 'Drive long, smooth, horizontal strokes using the full length of the bow. Keep downward pressure through the handhold constant. A moderate, sustainable pace beats frantic short strokes every time.',
        svg: SVG.bowdrill,
        tip: 'Think rowing, not sawing. The goal is consistency for 45–60 seconds, not maximum speed.',
      },
      {
        title: 'Reading the Smoke',
        body: 'Thin white smoke means not hot enough — keep going. Thick white smoke means you are close. If smoke continues rising after you stop drilling, you have an ember. Stop and collect immediately.',
        svg: SVG.bowdrill,
        timer: 60,
        timerLabel: 'Drill hard for 60 seconds without stopping',
        tip: 'Smoke that continues after you stop is the key sign. Stopping too early is the most common reason people fail at the last moment.',
      },
      {
        title: 'Collect the Ember',
        body: 'Gently tap the fireboard to release the coal onto the catchboard. It will look like a small, glowing black disc — not a bright orange glow. It is extremely fragile. Minimise movement.',
        svg: SVG.bowdrill,
        warning: 'Do not blow on the ember at this stage. It needs oxygen, not wind. Let it glow on the catchboard for 10 seconds before moving.',
      },
      {
        title: 'Transfer to Tinder Bundle',
        body: 'Hold your tinder bundle shaped like a bird\'s nest. Place the coal in the centre. Fold the bundle loosely around it. Hold up and blow slowly and steadily — not hard, not fast. Watch the bundle glow, then smoke, then burst into flame. Drop it immediately.',
        svg: SVG.bowdrill,
        warning: 'The bundle will be in your hands when it ignites. Have your fire lay ready before you start.',
      },
      {
        title: 'Troubleshooting',
        body: 'No smoke: wood is too wet or wrong species — try different materials. Smoke but no ember: notch position is wrong — recut to just past centre of depression. Ember crumbles: notch is too large or spindle has burned through — make notch smaller. Spindle wobbles: lock your wrist harder against your shin.',
        svg: SVG.bowdrill,
      },
    ],
    instructorNotes: {
      mistake: 'Students focus on speed instead of consistency. Demonstrate slow-and-sustained vs fast-and-jerky side by side.',
      fastTrack: 'Have students drill over an already-warm fireboard (pre-drilled by instructor). The feedback from getting an early ember is highly motivating.',
      adaptations: 'People with wrist injuries can use a chest harness to maintain downward pressure. Elderly students may need a longer bow for more mechanical advantage.',
    },
    competencyTest: 'Student produces an ember and transfers it to a tinder bundle resulting in flame, unaided, in under 10 minutes.',
  },

  {
    id: '1.3', category: 'fire', icon: '🔥',
    title: 'Reading Fire',
    difficulty: 'beginner',
    learnTime: '30 min study',
    teachTime: '20 min classroom + field observation',
    desc: 'Flame colour and smoke type tell you what is burning and whether it is dangerous. This knowledge can save your life.',
    materials: [],
    steps: [
      { title: 'Yellow / Orange Flame', body: 'Normal wood combustion. Good airflow, appropriate heat. This is what you want to see.' },
      { title: 'Blue Flame', body: 'Gas burning — propane, methane, or similar. Leave the area immediately. Do not approach, do not try to extinguish.', warning: 'Blue flame = gas. Evacuate immediately.' },
      { title: 'Green Flame', body: 'Copper compounds or treated wood chemicals burning. Fumes are toxic. Stay well upwind and do not breathe the smoke.', warning: 'Green flame = toxic chemicals. Stay upwind, do not inhale.' },
      { title: 'White Smoke', body: 'Water vapour — wood with moisture content, green wood, or grass burning. Not dangerous but inefficient. Switch to drier fuel if available.' },
      { title: 'Black Smoke', body: 'Rubber, plastic, or petroleum products burning. Highly toxic — never burn these materials, and if you encounter this smoke, move upwind immediately.', warning: 'Black smoke = toxic. Do not inhale. Move upwind.' },
      { title: 'Minimal / Clear Smoke', body: 'Dry hardwood burning efficiently at the right temperature. This is the ideal — maximum heat, minimum smoke signature, clean combustion.' },
    ],
    instructorNotes: {
      mistake: 'People tend to dismiss smoke colour as unimportant. Reinforce the blue flame = gas danger strongly.',
      fastTrack: 'Make a quick colour reference card for their kit. The knowledge is simple but must be instant recall.',
      adaptations: 'This is entirely verbal/visual — fully accessible to all students.',
    },
    competencyTest: 'Student correctly identifies all six flame/smoke types and their implications without reference.',
  },

  // ── KNOTS ────────────────────────────────────────────────────────────────────

  {
    id: '2.1', category: 'knots', icon: '🪢',
    title: 'Bowline',
    difficulty: 'beginner',
    learnTime: '15 min',
    teachTime: '5 min demo · 10 min supervised · student teaches another',
    desc: 'The king of knots. Forms a fixed loop that will not slip or tighten under load. Fast to tie, safe to untie even after heavy loading.',
    materials: ['Any rope or cordage, minimum 6 mm diameter'],
    steps: [
      { title: 'Form the Rabbit Hole', body: 'Hold the rope and form a small overhand loop in the standing part — the end of the rope that goes to the anchor. This loop is the "rabbit hole". The working end hangs below it.' },
      { title: 'Rabbit Up Through the Hole', body: 'Bring the working end (the rabbit) up through the loop from beneath. Remember: the rabbit comes up out of the hole.' },
      { title: 'Around the Tree', body: 'Pass the working end behind and around the standing part of the rope (the "tree"). The working end should now be pointing back toward the loop.' },
      { title: 'Back Down the Hole', body: 'Feed the working end back down through the same loop it came up through. The rabbit goes back into the hole.' },
      { title: 'Dress and Tighten', body: 'Hold the loop and pull both the standing part and the working end firmly. The knot should cinch into a neat fixed loop. Leave a tail of at least 15 cm beyond the knot.', tip: 'Always add a half hitch stopper knot if the load will be intermittent — bowlines can work loose under cycling loads.' },
    ],
    instructorNotes: {
      mistake: 'Students pull the wrong strand when tightening. Before they start, mark the working end with a piece of tape.',
      fastTrack: 'Teach the "rabbit hole tree hole" mnemonic verbally before any rope is in hand. Then demonstrate, then have them talk themselves through it aloud while tying.',
      adaptations: 'One-handed bowline technique exists for rescue situations — teach this as extension once the standard tie is solid.',
    },
    competencyTest: 'Student ties a correct bowline unaided in under 30 seconds.',
  },

  {
    id: '2.2', category: 'knots', icon: '🪢',
    title: 'Clove Hitch',
    difficulty: 'beginner',
    learnTime: '10 min',
    teachTime: '5 min demo · 10 min practice',
    desc: 'Fast, adjustable hitch for attaching rope to a post or pole. Not secure under intermittent load alone — always add half hitches.',
    materials: ['Rope', 'Post, pole, or carabiner to practise on'],
    steps: [
      { title: 'First Loop', body: 'Pass the rope over and around the post, crossing the standing part to create the first loop.' },
      { title: 'Second Loop', body: 'Make a second loop in the same direction, but this time tuck the working end under itself where it crosses over the first loop.' },
      { title: 'Tighten', body: 'Pull both ends to seat the knot firmly against the post.' },
      { title: 'Add Half Hitches', body: 'For any load that will cycle or pull from different angles, add two half hitches around the standing part below the clove hitch.', warning: 'A clove hitch alone can work loose. Always add half hitches when security matters.' },
    ],
    instructorNotes: {
      mistake: 'Students omit the half hitches and consider the knot done. Demonstrate the failure mode — pull the rope sideways and show it walk loose.',
      fastTrack: 'Show it in an end-of-rope (around a post) and on-a-bight (onto a carabiner) version. The bight version is faster and equally useful.',
      adaptations: 'Simple enough for children aged 8+.',
    },
    competencyTest: 'Student ties clove hitch + two half hitches on a post in under 20 seconds.',
  },

  {
    id: '2.3', category: 'knots', icon: '🪢',
    title: "Trucker's Hitch",
    difficulty: 'intermediate',
    learnTime: '30 min',
    teachTime: '20 min demo · 30 min practice with load',
    desc: 'A mechanical advantage system (approximately 3:1) built from rope alone. Used to lash loads tight — tarps, loads, splints, and structures.',
    materials: ['Rope minimum 5 m', 'Something to lash: tarp, poles, load'],
    steps: [
      { title: 'Anchor the End', body: 'Secure one end of the rope to a fixed anchor point with a round turn and two half hitches, or attach it to one side of what you are lashing.' },
      { title: 'Form the Loop', body: 'About halfway along the rope, form a bight and twist it into a fixed loop (a slipped overhand or alpine butterfly). This loop is your pulley.' },
      { title: 'Thread the Working End', body: 'Pass the working end around the far anchor point, then back up through the loop you just created.' },
      { title: 'Pull for Tension', body: 'Pull the working end down — the loop acts as a pulley giving you roughly 3:1 mechanical advantage. The load will compress significantly tighter than hand tension alone.' },
      { title: 'Lock Off', body: 'Maintain tension with one hand while tying two half hitches around the standing part below the loop with the other. Release tension — the half hitches hold it.' },
    ],
    instructorNotes: {
      mistake: 'Students release the load while tying off the half hitches. Teach the lock-one-hold-one technique explicitly.',
      fastTrack: 'Have students practise on a tarp first where the visual feedback of compression is obvious and motivating.',
      adaptations: 'The mechanical advantage makes this ideal for people with limited strength — teach it specifically to elderly or less physically strong students.',
    },
    competencyTest: 'Student correctly applies a trucker\'s hitch and achieves noticeably tight compression on a tarp or load.',
  },

  {
    id: '2.4', category: 'knots', icon: '🪢',
    title: 'Sheet Bend',
    difficulty: 'beginner',
    learnTime: '10 min',
    teachTime: '5 min demo · 10 min practice',
    desc: 'The standard knot for joining two ropes of different thicknesses. Simple, strong, and essential.',
    materials: ['Two ropes of different thickness'],
    steps: [
      { title: 'Bight in Thick Rope', body: 'Form a bight (U-shape) in the end of the thicker rope. Hold it open in your non-dominant hand.' },
      { title: 'Thin Rope Through', body: 'Pass the working end of the thinner rope up through the bight from beneath.' },
      { title: 'Around Behind', body: 'Bring the thin rope around behind both strands of the bight.' },
      { title: 'Tuck and Tighten', body: 'Tuck the working end of the thin rope under itself where it crosses the bight. Dress the knot and pull both ropes to tighten.', tip: 'For extra security, make a double sheet bend: take an extra turn around the bight before tucking. Use this for wet or slippery rope.' },
    ],
    instructorNotes: {
      mistake: 'Students try to use it on same-thickness ropes — it slips. Show when to use it vs a reef knot.',
      fastTrack: '5 minutes, then have them teach their neighbour.',
      adaptations: 'Easy enough for children.',
    },
    competencyTest: 'Student correctly joins two different-diameter ropes with a sheet bend in under 20 seconds.',
  },

  {
    id: '2.5', category: 'knots', icon: '🪢',
    title: 'Figure of Eight',
    difficulty: 'beginner',
    learnTime: '10 min',
    teachTime: '5 min demo · 10 min practice',
    desc: 'The standard stopper knot. Also forms a bomb-proof fixed loop (figure of eight on a bight). Never slips, easy to inspect.',
    materials: ['Any rope'],
    steps: [
      { title: 'Form a Loop', body: 'Make a loop in the rope about 15 cm from the working end, with the working end on top.' },
      { title: 'Working End Behind', body: 'Pass the working end behind and around the standing part.' },
      { title: 'Back Through the Loop', body: 'Push the working end back down through the original loop from the front.' },
      { title: 'Dress and Tighten', body: 'Pull on both strands to tighten. The finished knot should look like the number 8.', tip: 'For a fixed loop: fold the rope in half and tie the eight using the bight as the working end. Thread the end around an anchor and "follow the rope back" to create a fixed loop at the anchor.' },
    ],
    instructorNotes: {
      mistake: 'Students confuse it with an overhand knot. Emphasise the rope makes a figure-8 shape when laid flat before tightening.',
      fastTrack: 'Simple and fast. Main teaching point is the follow-through version for creating loops.',
      adaptations: 'Suitable for all ages and abilities.',
    },
    competencyTest: 'Student ties a figure of eight and a figure of eight on a bight correctly.',
  },

  {
    id: '2.6', category: 'knots', icon: '🪢',
    title: 'Prusik Hitch',
    difficulty: 'intermediate',
    learnTime: '20 min',
    teachTime: '20 min demo · 30 min practice on vertical rope',
    desc: 'A friction hitch that grips under load and slides when unloaded. Used to ascend a rope, capture progress, or back up a descender.',
    materials: ['Main rope (at least 10 mm)', 'Prusik loop — thin cord 5–7 mm, or accessory cord folded in half'],
    steps: [
      { title: 'Prepare the Loop', body: 'Tie a short piece of thin cord into a loop using a double fisherman\'s knot. The loop should be small enough that when doubled around the main rope, it forms a compact hitch.' },
      { title: 'Wrap Around Main Rope', body: 'Hold the loop at the middle. Wrap both ends around the main rope together three times, working upward from your first contact point.' },
      { title: 'Thread Through Itself', body: 'Pass both ends of the loop through the remaining loop created at the bottom. Pull down to snug the wraps together.' },
      { title: 'Dress the Hitch', body: 'All three wraps should sit neatly side by side. No crossing, no twisting.' },
      { title: 'Test', body: 'Apply weight downward — the hitch grips and holds. Push upward — it slides freely. If it does not grip, add a fourth wrap or use thinner cord.', tip: 'Cord diameter matters: the prusik cord must be significantly thinner than the main rope. Same diameter = no grip.' },
    ],
    instructorNotes: {
      mistake: 'Students use cord too close in diameter to the main rope. Have a range of cord diameters to demonstrate why this matters.',
      fastTrack: 'Teach on a horizontal rope first so students can feel the grip/slide difference without hanging weight.',
      adaptations: 'Asymmetric versions (klemheist) can be easier for one-handed operation.',
    },
    competencyTest: 'Student ties a prusik correctly and demonstrates it grips under load and slides when pushed.',
  },

  {
    id: '2.7', category: 'knots', icon: '🪢',
    title: 'Constrictor Knot',
    difficulty: 'intermediate',
    learnTime: '20 min',
    teachTime: '15 min demo · 20 min practice',
    desc: 'The most powerful binding knot. Self-tightening under load. Used for improvised splints, whipping rope ends, binding bundles.',
    materials: ['Rope or cord', 'Object to bind (pole, rolled material, rope end)'],
    steps: [
      { title: 'Two Turns Around Object', body: 'Wrap the working end twice around the object, creating two parallel turns.' },
      { title: 'Cross Over', body: 'On the second turn, cross the working end over the standing part.' },
      { title: 'Tuck Under Both Turns', body: 'Tuck the working end under both turns of the rope (not just the top one).' },
      { title: 'Tighten Firmly', body: 'Pull both ends hard simultaneously. The knot cinches into a very tight grip and will not release under load.', warning: 'This knot can only be removed by cutting. Do not use on anything that must be released quickly.' },
      { title: 'Permanent Application', body: 'For whipping rope ends or permanent binding, use this as your go-to. For splints, apply over padding and check circulation regularly.' },
    ],
    instructorNotes: {
      mistake: 'Students tie a clove hitch instead — similar start but different tuck. Emphasise the "under both turns" step.',
      fastTrack: 'Have students whip the end of a piece of rope using this knot. The immediate practical result is motivating.',
      adaptations: 'Requires some hand strength to tighten. Help students who struggle to get the initial tension.',
    },
    competencyTest: 'Student applies a constrictor knot that cannot be loosened by hand.',
  },

  {
    id: '2.8', category: 'knots', icon: '🪢',
    title: 'Round Turn and Two Half Hitches',
    difficulty: 'beginner',
    learnTime: '10 min',
    teachTime: '5 min demo · 10 min practice',
    desc: 'The most reliable knot for attaching a rope to a ring, post, or anchor point when the load may come from any direction.',
    materials: ['Rope', 'Ring, post, or anchor'],
    steps: [
      { title: 'Full Round Turn', body: 'Pass the rope around the anchor twice, creating a full round turn. The round turn distributes the load and reduces the force on the half hitches.' },
      { title: 'First Half Hitch', body: 'Bring the working end across the standing part and push it under to form the first half hitch.' },
      { title: 'Second Half Hitch', body: 'Repeat the half hitch in the same direction. Two half hitches lock each other.' },
      { title: 'Dress and Test', body: 'Slide the half hitches tight against the anchor. The knot should be secure under tension from any direction.', tip: 'The round turn does most of the work. In an emergency you can hold a heavy load with just the round turn while you tie off the half hitches.' },
    ],
    instructorNotes: {
      mistake: 'Students do a half turn instead of a full round turn, reducing security significantly.',
      fastTrack: 'This is the fastest knot to learn that is also fully secure. Prioritise it early.',
      adaptations: 'Easy for all ages. Good introductory knot for children.',
    },
    competencyTest: 'Student attaches rope securely to a post in under 15 seconds.',
  },

  {
    id: '2.9', category: 'knots', icon: '🪢',
    title: 'Square Lashing',
    difficulty: 'intermediate',
    learnTime: '30 min',
    teachTime: '30 min demo · 45 min practice',
    desc: 'Joins two poles at right angles. The foundation of all improvised structure building — shelters, tables, stretchers, ladders.',
    materials: ['Two straight poles', '4–6 m of rope or natural cordage'],
    steps: [
      { title: 'Clove Hitch Start', body: 'Begin with a clove hitch on one pole, just below where the second pole will cross.' },
      { title: 'Wrap Pattern — 3 Passes', body: 'Take the rope over the cross pole, under the vertical pole, over the cross pole on the other side, and under the vertical — this is one wrap. Repeat 3–4 times pulling tight with each pass.' },
      { title: 'Frapping Turns', body: 'Make 2–3 tight turns of rope in the gap between the poles (around the lashing, not the poles). These pulls the wraps tight and locks the lashing.' },
      { title: 'Clove Hitch Finish', body: 'Finish with a clove hitch on the second pole. Test: the junction should feel completely rigid with no play in any direction.' },
    ],
    instructorNotes: {
      mistake: 'Students rush the frapping turns. Frapping is what converts a floppy lashing into a rigid joint — emphasise it.',
      fastTrack: 'Build something useful: a small table, a stretcher, a pot hanger. Students learn better with a real outcome.',
      adaptations: 'Requires grip strength. Pre-cut rope lengths help people with limited dexterity manage the wraps.',
    },
    competencyTest: 'Student builds a rigid pole junction that does not move under hand pressure from any direction.',
  },

  {
    id: '2.10', category: 'knots', icon: '🪢',
    title: 'Shear Lashing',
    difficulty: 'intermediate',
    learnTime: '30 min',
    teachTime: '30 min demo · 45 min practice',
    desc: 'Binds poles parallel first, then splays them apart to form an A-frame or sheer legs. Essential for raising loads and building A-frame shelters.',
    materials: ['Two poles equal length', '5–8 m of rope'],
    steps: [
      { title: 'Bind Poles Together', body: 'Lay two poles side by side, parallel. Start with a clove hitch on one pole.' },
      { title: 'Wrap 6–8 Times', body: 'Wrap loosely around both poles together 6–8 times. Looser than square lashing — this lashing needs to flex when splayed.' },
      { title: 'Frapping Turns', body: 'Two or three frapping turns in the gap between the poles. Finish with a clove hitch.' },
      { title: 'Splay the Poles', body: 'Stand the lashing upright and push the tops of the poles apart. The lashing tightens at the junction as the angle opens. Adjust to the angle required for your A-frame or sheer legs.' },
    ],
    instructorNotes: {
      mistake: 'Students wrap too tight initially — the poles then cannot be splayed. Teach them it should feel loose before splaying.',
      fastTrack: 'Build two sheer lashings and add a ridge pole between them: instant A-frame. Immediate visual reward.',
      adaptations: 'Splaying the poles requires two people. Good for practising cooperation.',
    },
    competencyTest: 'Student creates a stable A-frame using two shear lashings.',
  },

  {
    id: '2.11', category: 'knots', icon: '🪢',
    title: 'Improvised Rope Making',
    difficulty: 'intermediate',
    learnTime: '2 hrs to produce usable rope',
    teachTime: '30 min demo · 2 hrs practice',
    desc: 'When no cordage is available, make it from plant fibres, bark, or roots. A usable length of rope can be produced in an afternoon.',
    materials: ['Long plant fibres: stinging nettles, iris leaves, bark strips from willow or lime', 'Smooth stick for tensioning'],
    steps: [
      { title: 'Gather and Prepare Fibres', body: 'Gather long, stringy plant fibres. Nettles: crush stems, remove outer skin, extract the inner fibres. Bark: use inner bark from willow or lime, split into long strips. Dry fibres are stronger — retted (rotted slightly in water) fibres are more pliable.' },
      { title: 'Split Into Even Bunches', body: 'Divide fibres into two even bunches of similar thickness. Thinner bunches produce finer, stronger rope. Test: a single strand should be difficult to break.' },
      { title: 'Reverse Twist', body: 'Twist the first bundle clockwise between your fingers until it wants to kink. Hold this tension and twist the second bundle the same way. Now twist both bundles together counter-clockwise — they will ply together naturally.' },
      { title: 'Extend as You Go', body: 'When a bundle is running short, lay in new fibres alongside and continue twisting. Stagger the join points between the two bundles so they do not both end at the same place.' },
      { title: 'Test Your Rope', body: 'A single strand of plant fibre cordage should support at least 20 kg without breaking. Test before trusting with any load.' },
      { title: 'Store Dry', body: 'Natural cordage loses significant strength when wet. Keep it dry or re-twist after wetting. For structural use, double or triple the rope.' },
    ],
    instructorNotes: {
      mistake: 'Students twist in the same direction for both stages. The reverse-twist principle is the core insight — explain it clearly before starting.',
      fastTrack: 'Using nettle or iris is fastest for feedback. Bark cordage takes longer but produces tougher rope.',
      adaptations: 'A rewarding skill for children and older students alike — the process is slow and rhythmic, no strength required.',
    },
    competencyTest: 'Student produces 50 cm of rope that supports a 10 kg load without breaking.',
  },

  // ── NAVIGATION ────────────────────────────────────────────────────────────────

  {
    id: '3.1', category: 'navigation', icon: '🧭',
    title: 'Using a Compass',
    difficulty: 'beginner',
    learnTime: '2 hrs',
    teachTime: '1 hr classroom + 2 hrs field exercise',
    desc: 'A compass works without power, satellites, or infrastructure. Learn to take and follow bearings accurately — GPS is a luxury, not a skill.',
    materials: ['Silva-type baseplate compass', 'Topographic map (1:25,000 or 1:50,000)', 'Pencil'],
    steps: [
      { title: 'Hold the Compass Level', body: 'Hold it flat in your palm. A tilted compass creates a friction point and the needle will give a false reading. Wait for the needle to stop swinging before reading.' },
      { title: 'Take a Bearing to a Target', body: 'Point the direction-of-travel arrow at your target. Rotate the bezel (the outer ring) until the orienting arrow aligns with the red (north) end of the needle. "Red in the shed" — the red needle sits inside the orienting arrow box.', svg: SVG.compass },
      { title: 'Read Your Bearing', body: 'Read the number at the index line. This is your bearing to the target. Write it down.' },
      { title: 'Follow a Bearing', body: 'Set your desired bearing on the bezel. Hold the compass at your waist. Rotate your whole body until the red needle sits in the orienting arrow. The direction-of-travel arrow now points your route.' },
      { title: 'Pick a Landmark', body: 'Look up along the direction-of-travel arrow. Pick a visible landmark (tree, rock, building) on that line. Walk to it. Repeat — do not keep looking at the compass while walking.' },
      { title: 'Triangulation', body: 'To find your position: take a bearing to an identifiable landmark, draw the back-bearing line on your map from that landmark. Repeat with a second landmark. Where the two lines cross is your position.', svg: SVG.compass },
      {
        title: 'Magnetic Declination',
        body: 'The needle points to magnetic north, not true north. In the UK, declination is approximately 1–2° west — negligible for most use. Check your map margin for the current value for your region.',
        tip: 'Mnemonic: "Grid to Mag, Add. Mag to Grid, Get rid." — for adding/subtracting declination when converting between map bearings and compass bearings.',
      },
    ],
    instructorNotes: {
      mistake: 'Students read the wrong end of the needle. Drill "red in the shed" until it is automatic.',
      fastTrack: '5-minute classroom on parts and vocabulary, then straight into a field exercise with real targets to find.',
      adaptations: 'Silva compasses have large dials suitable for older eyes. Button or thumb compasses are too small for beginners.',
    },
    competencyTest: 'Student takes a bearing to a target, follows it 100m, and locates a hidden marker within 5m.',
  },

  {
    id: '3.2', category: 'navigation', icon: '🧭',
    title: 'Reading a Topographic Map',
    difficulty: 'intermediate',
    learnTime: '4 hrs',
    teachTime: '2 hrs classroom + field exercise',
    desc: 'A topographic map shows the shape of the land. Learn to see three dimensions in the lines and you can navigate anywhere without seeing the ground.',
    materials: ['1:25,000 OS map or equivalent', 'Ruler', 'Pencil'],
    steps: [
      { title: 'Contour Lines Never Cross', body: 'Each line connects points of equal elevation. If they crossed, a point would be at two heights — impossible. If you see crossing, you have misread the map.' },
      { title: 'Closer Lines = Steeper Slope', body: 'Lines packed tightly together mean the ground rises or falls quickly. Widely spaced lines mean a gentle gradient. Very tight lines = cliff.' },
      { title: 'V-Shapes Pointing Uphill = Valleys', body: 'Contour lines form a V-shape that points toward higher ground when they cross a valley or stream. Water always runs into the V.' },
      { title: 'V-Shapes Pointing Downhill = Ridges', body: 'V-shapes pointing toward lower ground indicate a ridge or spur projecting downhill.' },
      { title: 'Closed Circles = Hilltops', body: 'A contour line that forms a closed circle or oval marks a hilltop or high point. The innermost circle is the summit.' },
      { title: 'Index Contours', body: 'Every fifth contour line is printed thicker and labelled with the elevation. Use these to quickly count your height gain or loss.' },
      { title: 'Grid References', body: 'Four-figure reference: 1 km square. Six-figure: 100 m square. Always read eastings first (left to right) then northings (bottom to top). Mnemonic: "Along the corridor, then up the stairs."' },
    ],
    instructorNotes: {
      mistake: 'Students read V-shapes wrong — confusing valleys and ridges. Take them to a viewpoint where they can look at real terrain and the map simultaneously.',
      fastTrack: 'Find a map of somewhere the student knows well. Recognition of familiar terrain accelerates map-reading fluency.',
      adaptations: 'Use a 3D terrain model or sand tray to bridge map-to-ground for visual learners.',
    },
    competencyTest: 'Student correctly identifies valley, ridge, hilltop, steep slope, and gentle slope on an unknown map section.',
  },

  {
    id: '3.3', category: 'navigation', icon: '🧭',
    title: 'Shadow Stick Navigation',
    difficulty: 'beginner',
    learnTime: '30 min (clear day required)',
    teachTime: '30 min field demonstration',
    desc: 'Find north using only a stick and the sun. No equipment required. Accurate to within a few degrees when done carefully.',
    materials: ['Straight stick ~50 cm', 'Two small stones or sticks as markers', 'Flat ground'],
    steps: [
      { title: 'Push Stick Into Ground', body: 'Find a clear, flat piece of ground. Push a straight stick vertically into the ground so it casts a clear shadow.' },
      { title: 'Mark the First Shadow Tip', body: 'Place a small stone or stick at the exact tip of the shadow. Note the time.' },
      { title: 'Wait 15–20 Minutes', body: 'The shadow will move as the sun moves across the sky. Do not disturb the stick or first marker.', timer: 900, timerLabel: 'Wait 15 minutes for shadow to move' },
      { title: 'Mark the New Shadow Tip', body: 'Place a second marker at the new shadow tip position.' },
      { title: 'Draw a Line Between Markers', body: 'The line between your two markers runs approximately west to east — the first mark is west, the second is east.', svg: SVG.shadowstick },
      { title: 'Find North', body: 'Stand with your first (west) mark at your left foot and the second (east) mark at your right foot. You are now facing north.', tip: 'Works in both hemispheres. The sun always moves west to east across the sky — the shadow always moves east to west.' },
    ],
    instructorNotes: {
      mistake: 'Students mix up which mark is west and which is east. Teach the logic: shadow moves opposite to the sun, sun moves east to west in the sky, therefore shadow moves west to east.',
      fastTrack: 'Run this as a full demonstration start-to-finish on a clear morning and verify with a compass. The accuracy is usually impressive.',
      adaptations: 'Accessible to all. Works well with children.',
    },
    competencyTest: 'Student performs the shadow stick method and identifies north within 15 degrees of compass north.',
  },

  {
    id: '3.4', category: 'navigation', icon: '🧭',
    title: 'Star Navigation',
    difficulty: 'intermediate',
    learnTime: '2 hrs (clear night required)',
    teachTime: '1 hr classroom + clear night field session',
    desc: 'Find true north or south using stars. More accurate than a compass — Polaris is within 1° of true north.',
    materials: ['Clear night sky', 'Red-light torch (to preserve night vision)', 'Star chart (optional)'],
    steps: [
      { title: 'Locate the Plough / Big Dipper', body: 'Find the seven-star formation shaped like a saucepan or plough. In the northern hemisphere, it is visible on most clear nights and never sets below the horizon in the UK.', svg: SVG.stars },
      { title: 'Find the Pointer Stars', body: 'The two stars forming the outer edge of the "pan" (Dubhe and Merak) are the pointer stars. Draw an imaginary line through them toward the "open" end of the saucepan.' },
      { title: 'Extend Five Times the Distance', body: 'Extend that imaginary line approximately five times the distance between the pointer stars. The moderately bright star you reach is Polaris.' },
      { title: 'Polaris = True North', body: 'Polaris does not visibly move because it sits almost directly above the north pole. Stand facing Polaris and you face true north — accurate to within 1°.' },
      { title: 'Southern Hemisphere — Southern Cross', body: 'Locate the Southern Cross (four main stars). Extend the long axis of the cross 4.5 times its length. Drop a perpendicular from the midpoint between the two Pointer Stars. Where the two lines intersect is the South Celestial Pole — south is directly below.' },
      { title: 'Moon Navigation', body: 'For a crescent moon: draw an imaginary line connecting the two horn tips down to the horizon — this approximate point is south (northern hemisphere). Only works when the moon is clearly crescent-shaped.' },
    ],
    instructorNotes: {
      mistake: 'Students extend the pointer line in the wrong direction. Show both directions and explain only one reaches a star of the right brightness.',
      fastTrack: 'A single clear night session outdoors is worth more than hours of classroom teaching. Go outside.',
      adaptations: 'Binoculars help confirm Polaris for students with limited vision.',
    },
    competencyTest: 'Student locates Polaris and identifies north within 5° without compass assistance.',
  },

  {
    id: '3.5', category: 'navigation', icon: '🧭',
    title: 'Natural Navigation Signs',
    difficulty: 'intermediate',
    learnTime: '2 hrs field observation',
    teachTime: '2 hr outdoor walk',
    desc: 'Nature provides a constant stream of directional information. These signs are less reliable individually — use multiple together to build a picture.',
    materials: [],
    steps: [
      { title: 'Tree and Vegetation', body: 'In the UK, moss tends to grow on the north side of trees and rocks where moisture is retained. Tree canopies are generally more developed on the south-facing side. These are tendencies, not rules — always look for corroborating signs.' },
      { title: 'Prevailing Wind', body: 'In the UK, the prevailing wind is from the south-west. Trees and vegetation on exposed hilltops are shaped by this — branches extend downwind to the north-east. Wind-shaped trees act as standing indicators.' },
      { title: 'Spider Webs', body: 'Spiders prefer to build webs where they will be warmed by morning sun — typically facing south or south-east. Observation study in your region will refine this.' },
      { title: 'Ant Hills', body: 'Wood ant hills tend to be built on the south side of trees or on south-facing slopes to capture maximum warmth. The south face of an ant hill is typically lower and less steep.' },
      { title: 'Star Drift', body: 'All stars appear to drift westward across the sky due to the Earth\'s rotation. A star on the horizon moving left is moving north; moving right is moving south; rising is in the east; setting is in the west.' },
      { title: 'Building Rule', body: 'Alone, each sign is a suggestion. Two signs pointing the same way is a reasonable indicator. Three or more is reliable. Never navigate on one sign alone when your safety depends on it.' },
    ],
    instructorNotes: {
      mistake: 'Students take individual signs as certainties. Teach as probability and corroboration, not rule.',
      fastTrack: 'A 2-hour walk with a compass, comparing compass reading to natural signs at each stop, builds calibrated intuition fast.',
      adaptations: 'Excellent for all ages and abilities — observation-based, no physical demands.',
    },
    competencyTest: 'Student identifies the approximate cardinal direction at five different points using natural signs alone, verified by compass.',
  },

  // ── FIRST AID ────────────────────────────────────────────────────────────────

  {
    id: '4.1', category: 'first-aid', icon: '🩺',
    title: 'Stopping Severe Bleeding',
    difficulty: 'beginner',
    learnTime: '1 hr (practice on training pad)',
    teachTime: '30 min + hands-on practice per person',
    desc: 'Uncontrolled haemorrhage kills in minutes. This is the single most important first aid skill. Know it. Practice it. Teach everyone.',
    materials: ['Thick pad or dressings (improvised: clean cloth, clothing)', 'Gloves if available', 'Belt or cloth strip (minimum 3 cm wide) for tourniquet', 'Stick or pen for windlass'],
    steps: [
      { title: 'Direct Pressure — Always First', body: 'Gloves on if available. If not, bare hands — blood-borne disease risk is low in an emergency versus the certainty of death from uncontrolled bleeding. Place a thick pad on the wound. Press HARD — harder than you think necessary.', warning: 'Do NOT lift the pad to check how it is going. Every lift disrupts the clotting process. If blood soaks through, add more padding on top and press harder.' },
      { title: 'Maintain Direct Pressure 10 Minutes', body: 'Press continuously for a full ten minutes without stopping. Use your body weight — lean in. One person can press while another prepares further care.', timer: 600, timerLabel: '10 minutes continuous direct pressure — do not lift the pad' },
      { title: 'Wound Packing — for Deep Wounds', body: 'For deep, narrow wounds (stab wounds, gunshot wounds) where surface pressure is insufficient: pack gauze INTO the wound — not on top of it. Use your finger to push material into the wound cavity. Pack firmly until the wound is full.' },
      { title: 'Maintain Packing Pressure', body: 'Apply firm hand pressure over packed wound for 3 minutes minimum.', timer: 180, timerLabel: '3 minutes pressure on packed wound' },
      { title: 'Tourniquet — Limbs Only, Life-Threatening Only', body: 'Apply 5–7 cm above the wound. Never over a joint. Tighten until bleeding stops completely. Note the exact time of application. Do not remove once applied — removal in the field restores bleeding and may cause fatal blood pressure drop.', svg: SVG.tourniquet, warning: 'Tourniquets: limbs ONLY. Never neck, torso, groin, or armpits. These areas require wound packing. Improvised tourniquet minimum 3 cm wide — never rope or wire.' },
      { title: 'Improvised Tourniquet', body: 'Use a belt, torn clothing strip, or webbing at least 3 cm wide. Apply above wound, tie a half knot, place a stick or pen over the knot, tie another half knot over the stick. Twist until bleeding stops. Secure the stick with another tie so it cannot unwind.' },
    ],
    instructorNotes: {
      mistake: 'Students press too gently — social conditioning against hurting someone. Practise on a training pad with a pressure gauge or sponge squeeze toy to build muscle memory for correct force.',
      fastTrack: 'Practice direct pressure on self (thigh) to feel what "hard enough" actually means physically.',
      adaptations: 'People with limited hand strength can use their knee or a firm object (boot heel, rock) to maintain pressure. Teach this explicitly.',
    },
    competencyTest: 'Student correctly applies direct pressure and demonstrates correct tourniquet application on a training manikin or partner.',
  },

  {
    id: '4.2', category: 'first-aid', icon: '🩺',
    title: 'CPR',
    difficulty: 'beginner',
    learnTime: '2 hrs with practice manikin',
    teachTime: '1 hr per group of 4',
    desc: 'Cardiac arrest without CPR is fatal. With CPR, survival is possible. Learn this and practise it annually.',
    materials: ['CPR manikin (or improvised with a cushion and a thin board for compression resistance)', 'Gloves'],
    steps: [
      { title: 'Check Scene Safety', body: 'Before approaching: is the scene safe? Do not become a second casualty. Look for traffic, downed wires, unstable structures, ongoing violence.' },
      { title: 'Check for Response', body: 'Tap the shoulders firmly with both hands and shout clearly: "Are you alright?" Do this twice. No response = unresponsive.' },
      { title: 'Call for Help', body: 'Shout for help from bystanders. Send someone to call for medical help if available. Do not leave the patient alone to call yourself unless there is absolutely no one else.' },
      { title: 'Open Airway, Check Breathing', body: 'Tilt the head back, lift the chin to open the airway. Look, listen, and feel for normal breathing for up to 10 seconds. Occasional gasping is not normal breathing.' },
      { title: 'Hand Position', body: 'Heel of one hand on the centre of the chest (lower half of the breastbone). Second hand on top, fingers interlaced. Arms straight.', svg: SVG.cpr },
      { title: 'Compressions — 5 to 6 cm Deep', body: 'Press straight down. Aim for 5–6 cm depth on an adult. Allow complete chest recoil after each compression — do not lean on the chest between compressions.', timer: 30, timerLabel: '30 compressions at 100–120 per minute (count aloud)', tip: 'The song "Stayin\' Alive" by the Bee Gees is 103 BPM — close enough. Count aloud: 1-and-2-and-3-and... to pace yourself.' },
      { title: 'Rate and Rescue Breaths', body: 'Compression rate: 100–120 per minute. With rescue breaths: 30 compressions then 2 breaths (1 second each). If unwilling or unable to give rescue breaths: compression-only CPR is highly effective and preferred by many guidelines.' },
      { title: 'Continue Until', body: 'Continue until: the patient begins breathing normally, someone with more training takes over, you are physically unable to continue, or a medical professional tells you to stop. Fatigue is normal — rotate helpers every 2 minutes if possible.' },
    ],
    instructorNotes: {
      mistake: 'Insufficient depth. Adult ribs feel like they might break — this is correct. Actual rib fractures during CPR are common and irrelevant versus survival. Drill depth until it feels natural.',
      fastTrack: 'Compression-only CPR first — 30 compressions to a rhythm. Add rescue breaths as a secondary skill once compression quality is solid.',
      adaptations: 'Child CPR: 1 or 2 hands, one third of chest depth. Infant: 2 fingers, centre chest, very gentle tilt. Teach these as separate sessions after adult CPR is competent.',
    },
    competencyTest: 'Student performs 2 minutes of CPR at correct rate and depth, maintains rescue breath ratio, and switches smoothly with a partner.',
  },

  {
    id: '4.3', category: 'first-aid', icon: '🩺',
    title: 'Choking Response',
    difficulty: 'beginner',
    learnTime: '1 hr',
    teachTime: '45 min + practice per person',
    desc: 'Choking kills quickly. The right response takes under 2 minutes to learn but must be automatic — there is no time to think.',
    materials: ['Practice manikin or partner for back blow practice'],
    steps: [
      { title: 'Encourage Coughing First', body: 'If the person can cough, speak, or breathe — encourage them to keep coughing. A strong cough is more effective than anything you can do. Only intervene if they cannot cough or coughing is becoming weaker.' },
      { title: '5 Back Blows', body: 'Stand to the side and slightly behind. Support their chest with one hand. Lean them forward. Give 5 firm blows between the shoulder blades with the heel of your hand. Each blow should be a separate, deliberate strike.' },
      { title: 'Check the Mouth', body: 'After 5 back blows: look in the mouth. If you can see the object, carefully remove it with a finger. Do not do blind finger sweeps — you may push it further in.' },
      { title: '5 Abdominal Thrusts', body: 'Stand behind the person. Make a fist with one hand, place it thumb-side in against their abdomen just above the navel and well below the breastbone. Grasp your fist with the other hand. Pull sharply inward and upward 5 times.' },
      { title: 'Alternate and Continue', body: 'Alternate between 5 back blows and 5 abdominal thrusts until the object is dislodged or the person becomes unconscious.', warning: 'If they become unconscious: lower them to the ground, call for help, start CPR. Each time you open the airway to give breaths, look for and remove any visible object.' },
      { title: 'Pregnant or Obese — Chest Thrusts Only', body: 'Abdominal thrusts cannot be used. Instead: same technique but place hands on the centre of the breastbone (same position as CPR) and thrust straight back.' },
      { title: 'Infant Choking', body: 'Face down across your lap or forearm, head lower than body. 5 back blows with 2 fingers. Turn face up. 5 chest thrusts with 2 fingers on centre of breastbone. Never abdominal thrusts on infants.' },
    ],
    instructorNotes: {
      mistake: 'Back blows are not firm enough. Demonstrate on a wooden table the force required — it should make a distinct sound.',
      fastTrack: 'Teach the sequence as a chant: "5 and check, 5 and check." The rhythm is the memory aid.',
      adaptations: 'Teach self-rescue: use the back of a chair or a countertop edge to perform improvised abdominal thrusts if alone.',
    },
    competencyTest: 'Student correctly demonstrates 5 back blows and 5 abdominal thrusts in the correct order, checks mouth between each cycle.',
  },

  {
    id: '4.4', category: 'first-aid', icon: '🩺',
    title: 'Recovery Position',
    difficulty: 'beginner',
    learnTime: '30 min',
    teachTime: '20 min demo + partner practice',
    desc: 'Protects an unconscious but breathing patient from choking on vomit or saliva while awaiting further help.',
    materials: [],
    steps: [
      { title: 'Check and Confirm', body: 'Use only for someone who is unconscious but breathing normally. If not breathing: start CPR instead.' },
      { title: 'Near Arm at Right Angle', body: 'Kneel beside the patient. Place the arm nearest to you out at a right angle from the body, elbow bent, palm facing upward.' },
      { title: 'Far Arm Across Chest', body: 'Bring the far arm across the chest. Hold the back of their hand against their cheek on your side.' },
      { title: 'Bend Far Knee Up', body: 'With your other hand, pull the far knee up so the foot is flat on the ground.' },
      { title: 'Roll Toward You', body: 'Pull the bent knee toward you, rolling the patient onto their side. The hand against their cheek prevents their face from hitting the ground.' },
      { title: 'Open the Airway', body: 'Tilt the head back gently to keep the airway open. Adjust the upper knee to a right angle so the patient is stable and cannot roll forward.' },
    ],
    instructorNotes: {
      mistake: 'Students rush and do not stabilise the head, risking airway closure. Slow it down — the recovery position is not an emergency speed manoeuvre.',
      fastTrack: 'Practise on each other. The kinesthetic learning from being placed in the position is as valuable as placing someone else.',
      adaptations: 'For suspected spinal injury: do not roll. Only move to recovery position if the airway is obstructed and cannot be cleared any other way.',
    },
    competencyTest: 'Student correctly places a conscious partner in the recovery position in under 60 seconds.',
  },

  {
    id: '4.5', category: 'first-aid', icon: '🩺',
    title: 'Fracture Splinting',
    difficulty: 'intermediate',
    learnTime: '2 hrs',
    teachTime: '1.5 hrs with practice materials',
    desc: 'Splinting immobilises a fracture, reduces pain, prevents further injury, and allows the patient to be moved safely.',
    materials: ['Rigid material for splint: sticks, walking pole, rolled sleeping mat, board', 'Padding: spare clothing, rolled socks, leaves', 'Bandages or strips of fabric for securing'],
    steps: [
      { title: 'Check Circulation Before Splinting', body: 'Check CMS: Circulation (is there a pulse below the injury? Is the skin warm?), Motor (can they feel you touching?), Sensation (can they move fingers or toes?). Record your baseline before applying the splint.' },
      { title: 'Immobilise Joint Above AND Below', body: 'A splint must immobilise the joint above and below the fracture — not just the fracture site. Arm fracture: from above the elbow to below the wrist. Leg: from above the knee to below the ankle.' },
      { title: 'Pad Bony Prominences', body: 'Place padding between the splint and the skin at all bony points (ankle, knee, wrist, elbow). Without padding, pressure sores develop within hours.' },
      { title: 'Apply Splint', body: 'Hold the splinting material alongside the limb. For a leg, a second splint on the opposite side provides better immobilisation. The broken limb should be supported in the position you find it unless circulation is compromised.' },
      { title: 'Secure Without Cutting Circulation', body: 'Tie bandages firmly but not so tight they cut circulation. You should be able to slip two fingers under each tie. Tie above and below, never directly over the fracture.' },
      { title: 'Recheck CMS Every 30 Minutes', body: 'Swelling will occur. What is comfortable at application may become a tourniquet within an hour. Loosen immediately if the patient reports increasing pain, numbness, or you see the limb changing colour.', timer: 1800, timerLabel: 'Set 30-minute reminder to recheck circulation' },
      { title: 'Arm Fracture — Sling', body: 'Support an arm fracture in a sling made from a triangular bandage or folded jacket. The sling takes the weight off the shoulder joint. Collar-and-cuff for mid-shaft humerus fractures where a full sling causes pain.' },
    ],
    instructorNotes: {
      mistake: 'Students do not pad between splint and skin. A 30-minute splint with no padding can cause pressure necrosis. Emphasise it.',
      fastTrack: 'Practise on a willing "patient" — physical feedback about tightness and comfort is irreplaceable.',
      adaptations: 'People with limited hand strength should work in pairs — one holds, one ties.',
    },
    competencyTest: 'Student correctly splints a "fractured" arm with appropriate joint immobilisation, padding, and CMS check.',
  },

  {
    id: '4.6', category: 'first-aid', icon: '🩺',
    title: 'Wound Closure',
    difficulty: 'intermediate',
    learnTime: '3 hrs',
    teachTime: '2 hrs with practice materials',
    desc: 'Most wounds should not be closed immediately. Clean first, wait, then close when appropriate. Getting this wrong causes deep infection.',
    materials: ['Clean water for irrigation (at least 500 ml)', 'Syringe or bag with small hole for irrigation pressure', 'Steri-strips or improvised butterfly strips (cut from tape)', 'Clean dressing material', 'Antiseptic if available'],
    steps: [
      { title: 'Irrigate Thoroughly First', body: 'Before any closure: irrigate. Use clean water under pressure — a syringe, a bag with a small hole, or a Ziploc bag with a pinhole. Minimum 500 ml, ideally 1 litre. The wound must be clean before it is closed. Closing a dirty wound seals in infection.' },
      { title: 'When NOT to Close', body: 'Do not close: animal or human bite wounds, wounds older than 6–8 hours (bacteria have multiplied), wounds with signs of infection (red, warm, swollen, pus), puncture wounds (they drain — closing traps infection).', warning: 'Animal bites must not be sutured. Irrigate extensively and leave open. Deep infection risk is high.' },
      { title: 'Steri-Strip Closure', body: 'Dry the skin around (not inside) the wound. Apply steri-strips perpendicular to the wound edges, drawing the edges together. Place strips every 5–8 mm. The goal is approximation — bringing edges close but not forcing them together.' },
      { title: 'Improvised Butterfly Strips', body: 'Cut a strip of medical tape into an H-shape: narrow in the middle, wide at each end. Apply across the wound like a steri-strip. Regular tape can also be used — stick to dry skin then fold the middle portion so it does not adhere to the wound itself.' },
      { title: 'Dressing', body: 'Cover with a clean dressing. Change every 24–48 hours or when soaked through. At each change: look, smell, feel for infection signs.' },
      { title: 'Red / Amber / Green Monitoring', body: 'GREEN: healing normally, slight redness at edges, minimal discharge. AMBER: increasing redness extending from wound, warmth, moderate swelling — monitor closely, clean again. RED: pus, red streaks extending from wound (lymphangitis), fever, the wound is worse than yesterday — this requires drainage and antibiotics if available.', warning: 'Red streaks extending from a wound toward the body core mean systemic infection. This is life-threatening without treatment.' },
    ],
    instructorNotes: {
      mistake: 'Students want to close wounds immediately. The "clean first, wait, then close" sequence is counter-intuitive — teach the reasoning explicitly.',
      fastTrack: 'Practice applying steri-strips on a banana peel — the texture is similar to skin and allows realistic wound closure practice.',
      adaptations: 'Fine motor skill required. Students with tremor may need a partner to hold the wound edges while they apply strips.',
    },
    competencyTest: 'Student correctly irrigates a wound, identifies whether closure is appropriate, and applies steri-strips that draw wound edges together without gapping.',
  },

  // ── HUNTING & FISHING ────────────────────────────────────────────────────────

  {
    id: '5.1', category: 'hunting', icon: '🎣',
    title: 'Snare Setting',
    difficulty: 'intermediate',
    learnTime: '4 hrs field practice',
    teachTime: '2 hrs + field placement supervised',
    desc: 'A well-placed snare works while you sleep. Set 5–10 snares to guarantee results. Location and placement are everything.',
    materials: ['Wire: 0.7–1 mm brass or galvanised for rabbit, 1.2 mm for fox', 'Wire cutters', 'Gloves (scent control)', 'Peg or anchor post'],
    steps: [
      { title: 'Find the Run', body: 'Look for flattened vegetation, a regular gap in a hedge, droppings, fur caught on thorns, and earth worn smooth. Rabbits use the same routes repeatedly — a good run shows clear wear. Set snares on active runs only.', svg: SVG.snare },
      { title: 'Size the Noose', body: 'Rabbit: loop diameter 10 cm (size of your fist). Fox: 20 cm. Squirrel: 6 cm set above a branch. The noose must be the right size — too large and the animal passes through; too small and it triggers without catching.' },
      { title: 'Set the Height', body: 'Rabbit: position the bottom of the loop at the height of a closed fist above the ground (approximately 10 cm). The rabbit\'s head should enter the noose, not its feet.' },
      { title: 'Anchor Firmly', body: 'Attach the snare to a solid stake or living root. The anchor must hold against a struggling animal. A rabbit will pull with considerable force when snared.' },
      { title: 'Minimise Scent', body: 'Wear gloves when handling snares. Do not urinate near your set. Rub wire through local soil before placing. Your scent on a snare will deter cautious animals for days.' },
      { title: 'Check Every 12 Hours', body: 'A snared animal that is not quickly killed suffers. More practically, a snared carcass left too long will be taken by predators or spoil.', warning: 'In the UK, snaring is regulated. Snares must be checked at least once every 24 hours by law. During a genuine survival situation, legal constraints are overridden by necessity of life, but return to legal compliance as soon as circumstances allow.' },
    ],
    instructorNotes: {
      mistake: 'Students set snares too high — the rabbit runs under the snare. The "fist height" rule is the core technique.',
      fastTrack: 'Have students identify and mark 5 good snare sites before making any snares — location selection is the primary skill.',
      adaptations: 'Wire manipulation requires moderate hand strength. Pre-formed loops can be prepared in advance.',
    },
    competencyTest: 'Student correctly identifies an active run and sets a properly sized and positioned snare.',
  },

  {
    id: '5.2', category: 'hunting', icon: '🎣',
    title: 'Figure-4 Deadfall Trap',
    difficulty: 'advanced',
    learnTime: '8 hrs carving and setting practice',
    teachTime: '2 hrs supervised carving + setting',
    desc: 'A gravity-powered trap using a heavy rock or log. Reliable when well-made. The notch work is precise — quality of carving determines success.',
    materials: ['Three straight sticks (30–40 cm each)', 'Heavy flat rock or log (5–15 kg)', 'Sharp knife for carving notches', 'Bait: food scraps, strong-smelling material'],
    steps: [
      { title: 'Cut Three Sticks', body: 'You need an upright stick, a diagonal brace, and a horizontal trigger. All three must be straight and dry hardwood. Green wood compresses and fails. Allow 30 min to find and prepare good sticks.' },
      { title: 'Carve the Upright Notch', body: 'On the upright stick (longest), carve a flat-topped horizontal notch near the top. This notch supports the weight of the rock via the diagonal stick. It must be flat and precisely cut — not angled, not rounded.' },
      { title: 'Carve the Diagonal Notch', body: 'On the diagonal brace, carve a matching notch at one end that interlocks with the upright notch. At the other end, carve a notch that accepts the trigger stick. The diagonal does the most work — carve it slowly.' },
      { title: 'Carve the Trigger', body: 'The trigger stick rests horizontally, one end touching the rock, the other notched into the diagonal. Carve a small square notch near one end. Bait is attached to or placed on the trigger near this notch.' },
      { title: 'Assemble and Test', body: 'Assemble the figure-4 structure under the propped rock. The assembly requires three hands — work with a partner. Test by touching the trigger gently with a stick. The trap should fire when trigger is disturbed.' },
      { title: 'Bait and Site', body: 'Bait must be placed so the animal must move the trigger to reach it. Guide the approach with sticks or stones so the animal approaches from the trigger end. Check every 4 hours.' },
    ],
    instructorNotes: {
      mistake: 'The diagonal notch is not flat — the trap fires spontaneously under rock weight. Carve and test dry before using.',
      fastTrack: 'Build the trap upside down first to understand how the pieces interact, then flip it to set.',
      adaptations: 'Carving requires hand strength and a sharp knife. Pre-carve the notches if teaching in a group and focus teaching on placement and baiting.',
    },
    competencyTest: 'Student builds a figure-4 deadfall that stands propped under a rock for at least 5 minutes without spontaneously firing.',
  },

  {
    id: '5.3', category: 'hunting', icon: '🎣',
    title: 'Field Dressing a Rabbit',
    difficulty: 'advanced',
    learnTime: 'supervised first attempt + practice',
    teachTime: '30 min demo + supervised attempt',
    desc: 'The fastest and cleanest method to prepare a rabbit in the field. Takes under 5 minutes when practised.',
    materials: ['Sharp knife', 'Water for rinsing'],
    steps: [
      { title: 'Confirm and Handle', body: 'Confirm the animal is dead. Hold the rabbit upright by its rear legs.' },
      { title: 'Skin — The Snap Method', body: 'Make a small cut through the skin at the midpoint of the back (between the front and back legs). Insert fingers under the skin on both sides of the cut. Pull sharply in opposite directions — skin slides off toward head and feet simultaneously. It will come free in one motion with practice.' },
      { title: 'Remove Head and Feet', body: 'Twist off or cut the head at the neck. Cut through the ankle joints to remove the feet. The body is now clean-skinned.' },
      { title: 'Open the Body Cavity', body: 'Make a shallow cut along the belly from the chest to the pelvis — shallow enough to cut skin and muscle but not pierce the gut. Work slowly. A pierced gut contaminates the meat with intestinal bacteria.' },
      { title: 'Remove the Organs', body: 'Pull the intestines, stomach, and bladder free and discard. The liver, kidneys, and heart are all edible and nutritious — set aside. Remove the lungs from the chest cavity.' },
      { title: 'Rinse and Divide', body: 'Rinse the body cavity with clean water. The rabbit can be cooked whole or divided at the joints: two rear legs, two front legs, saddle (loin). Cook within 2 hours or hang in a cool shaded location.' },
    ],
    instructorNotes: {
      mistake: 'Students cut too deep on the belly and pierce the gut. Teach them to pinch the skin up and away from the gut before cutting.',
      fastTrack: 'A calm, matter-of-fact instructor manner reduces student anxiety significantly.',
      adaptations: 'Some students need time to emotionally prepare. Acknowledge this — it is normal. Never pressure or mock someone for needing a moment.',
    },
    competencyTest: 'Student correctly prepares a rabbit for cooking with no gut contamination.',
  },

  {
    id: '5.4', category: 'hunting', icon: '🎣',
    title: 'Improvised Fishing',
    difficulty: 'intermediate',
    learnTime: '4 hrs field practice',
    teachTime: '2 hrs + field time',
    desc: 'Fish can be caught without any equipment. Line, hooks, and rod can all be improvised. Understanding fish behaviour is as important as the gear.',
    materials: ['Improvised line: paracord inner strands, twisted plant fibres, shoelace', 'Improvised hook: safety pin, wire bent to J-shape, bent thorn', 'Bait: earthworms, insects, small pieces of food', 'Stick for rod'],
    steps: [
      { title: 'Make an Improvised Hook', body: 'Bend stiff wire into a J-shape with a small barb bent at the bottom of the J. A safety pin straightened and re-bent works well. A gorge hook (straight piece of bone or thorn) is simpler: bait conceals it and fish swallow it whole — pull at a right angle to set it.' },
      { title: 'Find Fish', body: 'Fish hold in: deep slow pools, the inside of bends (slower water), shaded spots, downstream of obstructions (rocks, logs). Fish at dawn and dusk when fish feed most actively at the surface. Midday fishing is largely a waste of time.' },
      { title: 'Weir Trap', body: 'In a shallow stream: build a V-shaped barrier of stones, sticks, and mud across the stream width with the point of the V facing downstream. Leave an opening at the V-point just large enough for a fish to enter. Place a container (improvised basket, large leaves formed into a cup) at the opening. Fish moving downstream swim into the trap and cannot find the exit.', tip: 'A weir trap works passively — set it and check every few hours rather than sitting and watching.' },
      { title: 'Tickling', body: 'In cold, clear water: approach from downstream. Move very slowly along the bank or into the water. Find a fish resting under an overhang or ledge. Slide your hand very slowly under the fish from the tail end. Gently stroke the belly with your fingertips — fish become still. Then close grip and throw in one motion.' },
      { title: 'Spear Fishing', body: 'Cut a straight green stick 1.5–2 m long. Split the tip 15 cm using your knife and insert a small cross-stick to spread the tines. Sharpen both tines. Stand still and wait for fish to swim near. Aim below the fish — water refracts light and the fish is not exactly where it appears.' },
      { title: 'Timing and Patience', body: 'Fishing requires stillness and patience. Move slowly near water. Sound carries through water better than through air. Fish can feel footsteps. Stop, wait, observe before approaching.' },
    ],
    instructorNotes: {
      mistake: 'Students aim directly at fish when spear fishing and miss every time. Teach the refraction rule with a stick in a glass of water first.',
      fastTrack: 'Worm-on-hook in a productive pool produces fast feedback. Start here, not with the advanced techniques.',
      adaptations: 'Weir trap building is accessible to all ages and abilities — a group project with immediate practical return.',
    },
    competencyTest: 'Student correctly identifies productive fish habitat and demonstrates a correctly constructed improvised hook and line rig.',
  },

  // ── PLANT ID ──────────────────────────────────────────────────────────────────

  {
    id: '6.1', category: 'plants', icon: '🌿',
    title: 'Universal Edibility Test',
    difficulty: 'beginner',
    learnTime: '24+ hours per plant (the process takes time)',
    teachTime: '1 hr classroom + practice with known-safe plants',
    desc: 'A systematic protocol for testing unknown plants. Takes 24+ hours. Not foolproof but significantly reduces risk when no other food knowledge is available.',
    materials: ['The unknown plant', 'Water', 'Time — minimum 24 hours per plant tested'],
    steps: [
      { title: 'Critical Limitations — Read First', body: 'This test does NOT work for mushrooms. It cannot detect all toxins. It takes 24+ hours per plant. Never test when you have access to known-safe food. One part of a plant may be safe while another is toxic — test each part separately.', warning: 'Never eat large quantities of an untested plant. Test one small piece. Wait the full time periods between each stage. Rushing this test could kill you.' },
      { title: 'Separate Plant Parts', body: 'Treat roots, leaves, flowers, fruit, and seeds as separate plants. A plant may have edible leaves and toxic seeds or vice versa. Test each part you plan to eat individually.', svg: SVG.edibilitytest },
      { title: 'Smell Test', body: 'Crush the plant part and smell it. Discard immediately if it has a strong almond scent (cyanide), bitter chemical smell, or smells like bleach. A mild or neutral smell is acceptable to continue.' },
      { title: 'Skin Contact — 8 Hours', body: 'Rub a small amount on the inside of your wrist or elbow. Wait 8 hours. If you develop any rash, itching, blistering, or burning — discard the plant.', timer: 28800, timerLabel: '8 hours skin contact observation — do not eat yet' },
      { title: 'Lip and Mouth Contact', body: 'Touch the plant to your lip for 3 minutes. Then place a small amount in your mouth but do not swallow for 15 minutes. Watch for any burning, numbness, or unpleasant sensation. Discard if any occurs.' },
      { title: 'Swallow a Small Amount', body: 'Swallow a small amount (fingernail-sized piece). Wait 8 hours. Eat nothing else during this time. Watch for nausea, stomach pain, or dizziness. Drink water only.' },
      { title: 'Eating Portion', body: 'If all previous stages passed: eat a small but meaningful portion. Wait 24 hours. Only then, if no symptoms develop, is the plant considered reasonably safe to eat.' },
    ],
    instructorNotes: {
      mistake: 'Students think this is a faster process than it is. Emphasise the time commitment — it is genuinely a 24-hour protocol.',
      fastTrack: 'Practise the procedure using known-safe plants (dandelion, blackberry) so students can experience the procedure without risk.',
      adaptations: 'Intellectual content, accessible to all.',
    },
    competencyTest: 'Student correctly describes all 7 stages of the edibility test in order with correct time periods.',
  },

  {
    id: '6.2', category: 'plants', icon: '🌿',
    title: 'Ten Essential Plants',
    difficulty: 'beginner',
    learnTime: '2 hrs field study per plant group',
    teachTime: '2 hrs outdoor walk + ID practice',
    desc: 'Ten plants that occur widely across the UK and Europe. Know these and you have access to reliable food, medicine, and materials in almost any environment.',
    materials: ['Plant identification guide (printed)', 'Pencil for notes', 'Sample bags'],
    steps: [
      { title: 'Stinging Nettle', body: 'ID: heart-shaped serrated leaves, covered in fine stinging hairs, grows in dense clumps in disturbed soil, nitrogen-rich ground. No true lookalike. Neutralise sting by cooking or blanching. Uses: soup, tea (vitamin C, iron), fibre for cordage from stems.', tip: 'Grasp firmly and quickly — confidence prevents stings better than gloves.' },
      { title: 'Blackberry (Bramble)', body: 'ID: arching thorny canes, compound leaves with 3–5 leaflets, white-pink flowers, distinctive black berries in late summer. No dangerous lookalike — safe to eat from any blackberry. Uses: fruit (raw, cooked), leaves for tea, young shoots for food in spring.' },
      { title: 'Elder', body: 'ID: compound leaves with 5–7 leaflets, flat-topped clusters of small white flowers, clusters of small dark berries in autumn. CAUTION: red elder berries are toxic; only black/dark berries from flat-topped clusters are safe. Uses: elderflower (fresh or cordial), elderberries (cooked only — raw cause nausea).', warning: 'Danewort is a lookalike with similar flowers but foul smell. All parts of Danewort are toxic.' },
      { title: 'Rosehip', body: 'ID: red or orange oval fruits on rose bushes in autumn, five-petalled flowers in summer. All UK wild roses produce edible hips. Uses: very high vitamin C (20x more than oranges), rosehip syrup, tea, jam. Remove seeds and inner hairs before eating — they are irritants.' },
      { title: 'Hawthorn', body: 'ID: deeply lobed leaves, sharp thorns, white blossom in spring, red berries (haws) in autumn. Uses: young leaves and flower buds edible in spring (bread and cheese in old parlance), haws for jam and infusions. The tree itself makes excellent fuel and tool handles.' },
      { title: 'Plantain', body: 'ID: oval ribbed leaves growing flat to the ground in a rosette, grows in lawns, paths, compacted ground. Two species (broadleaf and ribwort) — both equally useful. Uses: leaves applied to wounds reduce inflammation and draw out infection, seeds are edible and nutritious.' },
      { title: 'Yarrow', body: 'ID: feathery finely divided leaves smelling faintly of herbs, flat-topped clusters of small white or pale pink flowers. Widespread in grassland. Uses: leaves applied to wounds slow bleeding (contains achilleic acid), tea for fever management, insect repellent.' },
      { title: 'Dandelion', body: 'ID: deeply toothed leaves in rosette, hollow stems producing milky sap, bright yellow composite flowers. Ubiquitous — if in doubt about any lawn weed, compare it carefully to a dandelion. Uses: entire plant is edible — leaves (young are less bitter), roots (roasted for coffee substitute), flowers.' },
      { title: 'Wild Garlic (Ramsons)', body: 'ID: broad bright green leaves, white star-shaped flowers, strong garlic smell when crushed — THE SMELL IS THE KEY. Grows in damp woodland in spring. CRITICAL LOOKALIKE: Lily of the Valley has very similar leaves but NO garlic smell and is DEADLY. Always crush and smell before eating.', warning: 'Lily of the Valley is extremely toxic. Always crush the leaf and smell it. If it does not smell of garlic, do not eat it.' },
      { title: 'Crab Apple', body: 'ID: small, hard, sour wild apples (2–4 cm diameter), often red or yellow, on deciduous trees with serrated oval leaves. Cannot be confused with anything dangerous. Uses: fruit edible raw (very sour) but best cooked, high in pectin for jam-making, cider production.' },
    ],
    instructorNotes: {
      mistake: 'Students identify by leaf shape alone. Teach a multi-sense approach: shape AND smell AND habitat AND season AND flower/fruit together.',
      fastTrack: 'Go outside and find each plant in order. Nothing replaces field identification — classrooms teach theory, fields build recognition.',
      adaptations: 'Bring plant samples indoors if outdoor access is limited. Press and label them as reference cards.',
    },
    competencyTest: 'Student correctly identifies 8 of the 10 plants from fresh or pressed samples without reference material.',
  },

  // ── CONSTRUCTION ─────────────────────────────────────────────────────────────

  {
    id: '7.1', category: 'construction', icon: '🪓',
    title: 'Basic Hand Tools',
    difficulty: 'beginner',
    learnTime: '2 hrs supervised use',
    teachTime: '1 hr demonstration + supervised use',
    desc: 'Correct grip, stance, and technique with hand tools. Safety and efficiency depend on posture before any other factor.',
    materials: ['Axe', 'Bow saw', 'Chisel and mallet', 'Draw knife (if available)', 'Appropriate wood for practice', 'Chopping block'],
    steps: [
      { title: 'Axe — Grip and Stance', body: 'Grip the axe at the base of the handle with both hands, dominant hand near the head and sliding to the base during the swing. Stand with feet shoulder-width, chopping block at knee height, all body parts outside the arc of the swing. Always chop on a stable chopping block — never the ground. The knee of your trailing leg is the furthest a missed axe will travel.' },
      { title: 'Bow Saw', body: 'Check blade tension before use — a loose blade cuts poorly and wanders. Let the weight of the saw do the work on both push and pull strokes. Use the full length of the blade. Do not force — if cutting is hard, the blade is dull or you are cutting against the grain. Support the wood so the cut does not bind on the blade.' },
      { title: 'Chisel', body: 'Always push away from your body. Secure the workpiece firmly — a sliding workpiece causes accidents. Bevel down for paring (slicing), bevel up for cutting deeper. Use a wooden mallet, not a metal hammer, to avoid mushrooming the handle end.' },
      { title: 'Draw Knife', body: 'Two-handed pulling tool for removing bark or shaping wood. Always pull toward your body with the workpiece clamped securely in a shaving horse or vise. Never push a draw knife. Read the grain — shave with the grain to avoid tearing.' },
      { title: 'Tool Maintenance', body: 'A sharp tool is a safe tool — it requires less force and behaves predictably. Keep axe and chisel edges touched up with a sharpening stone. Oil metal surfaces to prevent rust. Store blades covered. A blunt tool that requires force is the main cause of tool injuries.' },
    ],
    instructorNotes: {
      mistake: 'Students use an axe on unsupported wood held in one hand. Insist on the chopping block before any axe use.',
      fastTrack: 'Give students real work to do — split actual firewood, trim actual poles. Tool skill develops through purposeful use faster than through exercise.',
      adaptations: 'Lighter tools (smaller axe, shorter saw) for elderly or younger students. The technique is identical — only the tool weight changes.',
    },
    competencyTest: 'Student correctly splits a piece of firewood and cuts a length of timber using appropriate stance and technique, and correctly identifies one maintenance action needed on a tool.',
  },

  {
    id: '7.2', category: 'construction', icon: '🪓',
    title: 'Splitting and Preparing Timber',
    difficulty: 'beginner',
    learnTime: '2 hrs practical',
    teachTime: '1 hr demo + supervised practice',
    desc: 'Timber preparation for building and fuel. Reading grain, cleaving, and debarking — the foundation of all woodworking.',
    materials: ['Log or section of timber', 'Axe or froe (cleaving tool)', 'Maul and wedges for larger pieces', 'Draw knife for debarking'],
    steps: [
      { title: 'Read the Grain', body: 'Look at the end grain of the log. The growth rings show you where the wood will split easily — along the rings (tangentially) is harder; through the centre (radially) is easiest. Knots are grain disruptions and will cause splitting problems — plan your splits to avoid them.' },
      { title: 'Position for Splitting', body: 'Stand the log on the chopping block. Strike with the axe into the end grain. For large pieces, start a split with the axe then drive wooden wedges into the crack using the back of the axe as a maul. Never use metal wedges with an axe — the glancing blow hazard is severe.' },
      { title: 'Cleaving Green Wood', body: 'Green (freshly cut) wood splits along the grain far more easily than dry wood. If you are splitting for poles or planks rather than fuel, fresh wood is ideal. Dry wood is better for fuel — it burns with less smoke and more heat.' },
      { title: 'Debarking', body: 'Remove bark with a draw knife, back of an axe, or scraping stone. For structural timber, bark traps moisture against the wood and accelerates rot. Debarked timber lasts significantly longer. Bark also harbours insects.' },
      { title: 'Stacking to Season', body: 'Split timber dries (seasons) far faster than rounds. Stack with gaps between pieces for airflow. Elevate off the ground on rails or pallets. Cover the top only — not the sides. Softwood: 6 months minimum. Hardwood: 1–2 years for structural use, 2 years for clean burning.' },
    ],
    instructorNotes: {
      mistake: 'Students strike too hard and bury the axe. Medium controlled blows with a full follow-through are more effective than maximum force.',
      fastTrack: 'Have students produce a pile of split kindling — real output, fast feedback, genuinely useful.',
      adaptations: 'A froe (cleaving chisel driven by a mallet) is safer than an axe for beginners and those with less upper body strength.',
    },
    competencyTest: 'Student correctly reads grain direction and splits a small log into four even pieces without the axe sticking.',
  },

  {
    id: '7.3', category: 'construction', icon: '🪓',
    title: 'Basic Masonry',
    difficulty: 'intermediate',
    learnTime: '4 hrs practical',
    teachTime: '2 hrs supervised building',
    desc: 'Lay bricks or stone in a running bond. Build walls that are plumb, level, and weather-resistant.',
    materials: ['Bricks or stone', 'Sand (sharp sand for mortar)', 'Cement (Portland cement or lime)', 'Water', 'Trowel', 'Spirit level', 'String line', 'Bucket for mixing'],
    steps: [
      { title: 'Mix Mortar', body: 'Standard ratio: 3 parts sand to 1 part cement by volume. Add water gradually until the consistency is like peanut butter — it holds its shape when picked up on a trowel but is not stiff or crumbly. Mix only what you can use in 30–45 minutes; mortar sets quickly in warm weather.', svg: SVG.masonry },
      { title: 'Prepare the Base Course', body: 'The first course of bricks is the most important. Lay mortar on your foundation, set each brick level, and check with a spirit level after every 3 bricks. A slightly unlevel base course multiplies into a seriously unlevel wall.' },
      { title: 'Running Bond', body: 'Offset each course of bricks by half a brick width. Vertical joints must never align between courses — this is the running bond pattern and it distributes load across multiple bricks rather than creating a weak vertical line through the wall.' },
      { title: 'Butter the Ends', body: 'Apply mortar to the end of each brick (buttering) before placing it. This fills the perpendicular (vertical) joint. Do not rely on mortar on the course below to fill the vertical joint — it will not.' },
      { title: 'Check Plumb and Level', body: 'Check level along the course and plumb (vertical) up the wall with a spirit level after every 3–4 courses. Adjust while the mortar is still wet — once set it cannot be moved. A string line between corner profiles helps maintain consistent height.' },
      { title: 'Pointing', body: 'Once mortar is thumb-print firm (not wet, not hard), rake the joints back 10–15 mm and re-fill with fresh mortar using a pointing tool or bent rod. Slightly recessed weatherstruck pointing sheds water effectively and prevents frost damage.' },
    ],
    instructorNotes: {
      mistake: 'Students align vertical joints. Show what a wall looks like when this happens under load — the visual of the crack forming along the aligned joints is memorable.',
      fastTrack: 'Build a garden border or a small fire pit base. Real projects teach better than exercises.',
      adaptations: 'Mixing mortar is physically demanding. Pre-mix in batches and allow students to focus on the laying technique.',
    },
    competencyTest: 'Student lays a 3-course section of wall that is plumb and level with correctly staggered joints.',
  },

  {
    id: '7.4', category: 'construction', icon: '🪓',
    title: 'Thatching Basics',
    difficulty: 'advanced',
    learnTime: '2 days minimum for a small area',
    teachTime: 'Half-day introduction + several days supervised practice',
    desc: 'A traditional roofing technique with no manufactured materials required. Well-done thatch outlasts most modern roofing and provides excellent insulation.',
    materials: ['Water reed (best, 25–40 yr lifespan) or wheat straw (15–25 yr)', 'Hazel rods for liggers (horizontal fixing rods)', 'Split hazel spars (U-shaped staples) for pinning', 'Twine or wire', 'Leggett (flat bat for dressing thatch)'],
    steps: [
      { title: 'Minimum Pitch', body: 'Thatch requires a minimum 45° roof pitch to shed water effectively. Steeper is better — traditional English thatch is typically 50–55°. Below 45° and water penetrates between the stalks. Check your structure before beginning.', warning: 'Do not thatch below 45° pitch. The roof will fail and water damage will follow quickly.' },
      { title: 'Prepare Bundles', body: 'Thatch is applied in bundles (called yelms for straw, nitches for reed). Each bundle is 10–12 cm in diameter, tied firmly with twine. Straw goes in butt-end (cut end) outward. Reed goes butt-end down and outward.' },
      { title: 'First Course at Eaves', body: 'Begin at the eaves (bottom edge of the roof). The first course is the foundation for all subsequent courses and must overhang the eaves by 30–40 cm for water clearance. Fix with a ligger (horizontal hazel rod) pinned with spars driven at regular intervals.' },
      { title: 'Work Upward, Overlapping', body: 'Each subsequent course must overlap the previous by at least two-thirds. The thatching depth at any point should be a minimum 25–30 cm. Use the leggett to dress each course flush and neat.' },
      { title: 'Fixing with Liggers and Spars', body: 'Liggers are bent into place over the thatch. Spars are U-shaped staples split from hazel, twisted to form a spring. Drive spars through the lig and into the thatch to pin it firmly. Spacing: every 30–40 cm along each ligger.' },
      { title: 'Ridge and Expected Lifespan', body: 'The ridge is the most complex part and often uses sedge or decorated straw patterns. Water reed: 25–40 years. Wheat straw: 15–25 years. The ridge wears fastest and typically needs renewal at 10–15 years even when the main roof is sound.' },
    ],
    instructorNotes: {
      mistake: 'Insufficient overlap between courses. Minimum two-thirds overlap is not negotiable — less and the roof leaks at every course join.',
      fastTrack: 'Thatch a small garden structure (bee bole, kennel, porch) before tackling a building. The techniques are identical but the scale is manageable.',
      adaptations: 'Working at height requires confidence and physical fitness. Ground preparation of bundles is a valuable supporting role for those unable to work at height.',
    },
    competencyTest: 'Student correctly prepares and applies a 60 cm section of thatch at correct pitch with proper overlap and fixing.',
  },

];
