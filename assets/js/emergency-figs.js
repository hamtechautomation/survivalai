/* Emergency-card diagrams \u2014 simple line drawings, no images.
   Colours come from CSS (.ef-*), so they follow Night / High-contrast
   modes and print in black. Shared by emergency mode and the printed
   cards (print-essentials.html). Kept deliberately schematic: they show
   WHERE and HOW, the numbered steps carry the detail. */
(function () {
  'use strict';
  var FIGS = {

    /* CPR \u2014 seen from above: casualty on their back, hands stacked on the
       centre of the chest (lower half of the breastbone). */
    cpr: {
      caption: 'Heel of the hand on the centre of the chest, other hand on top. Arms straight, push straight down.',
      svg:
'<svg viewBox="0 0 260 150" role="img" aria-label="Hand position for CPR: centre of the chest">' +
  // head + neck
  '<circle class="ef-body" cx="34" cy="75" r="17"/>' +
  '<path class="ef-body" d="M51 68 L60 66 M51 82 L60 84"/>' +
  // torso
  '<path class="ef-body" d="M60 50 Q60 30 84 28 L176 32 Q196 34 198 52 L198 98 Q196 116 176 118 L84 122 Q60 120 60 100 Z"/>' +
  // sternum (dashed) + nipple line marks
  '<line class="ef-guide" x1="66" y1="75" x2="160" y2="75"/>' +
  '<circle class="ef-guide-dot" cx="112" cy="55" r="2"/><circle class="ef-guide-dot" cx="112" cy="95" r="2"/>' +
  // hands: two stacked ovals with interlaced fingers
  '<g class="ef-pulse">' +
    '<ellipse class="ef-key" cx="118" cy="75" rx="17" ry="13"/>' +
    '<ellipse class="ef-key2" cx="122" cy="75" rx="15" ry="11"/>' +
    '<path class="ef-keyline" d="M131 66 l12 -3 M133 72 l13 -1 M133 78 l13 1 M131 84 l12 3"/>' +
  '</g>' +
  // callout
  '<path class="ef-lead" d="M118 92 L118 128 L150 128"/>' +
  '<text class="ef-label" x="154" y="131">Centre of chest</text>' +
  '<text class="ef-label" x="20" y="108">head</text>' +
  '<text class="ef-label ef-strong" x="206" y="64">5\u20136 cm deep</text>' +
  '<text class="ef-label ef-strong" x="206" y="80">100\u2013120</text>' +
  '<text class="ef-label" x="206" y="94">per minute</text>' +
'</svg>'
    },

    /* Tourniquet \u2014 arm with a wound on the forearm; band 5\u20137 cm above it
       (towards the body), not on the elbow; windlass stick; time written. */
    tourniquet: {
      caption: '5\u20137 cm above the wound, towards the body \u2014 never on a joint. Tighten until the bleeding stops. Write the time.',
      svg:
'<svg viewBox="0 0 260 130" role="img" aria-label="Tourniquet placement: above the wound, not on a joint">' +
  // arm outline (shoulder left, hand right), elbow at x≈110
  '<path class="ef-body" d="M10 36 Q60 30 108 38 Q118 40 128 40 L210 44 Q222 44 230 48"/>' +
  '<path class="ef-body" d="M10 86 Q60 92 108 84 Q118 82 128 82 L210 76 Q222 76 230 72"/>' +
  '<path class="ef-body" d="M230 48 Q246 50 250 60 Q246 70 230 72"/>' +
  // elbow joint marker
  '<path class="ef-guide" d="M114 34 L114 90"/>' +
  '<path class="ef-lead" d="M114 92 L106 104"/>' +
  '<text class="ef-label" x="40" y="114">elbow \u2014 not here</text>' +
  // wound
  '<g class="ef-wound"><ellipse cx="196" cy="60" rx="9" ry="6"/><path d="M190 60 l12 0 M196 55 l0 10"/></g>' +
  // band + windlass
  '<g class="ef-pulse">' +
    '<rect class="ef-key" x="150" y="38" width="12" height="46" rx="2"/>' +
    '<line class="ef-stick" x1="143" y1="28" x2="170" y2="94"/>' +
  '</g>' +
  // distance bracket band → wound
  '<path class="ef-lead" d="M156 22 L156 16 L196 16 L196 22"/>' +
  '<text class="ef-label ef-strong" x="160" y="11">5\u20137 cm</text>' +
  '<text class="ef-label" x="144" y="104">band</text>' +
  '<text class="ef-label" x="186" y="96">wound</text>' +
  '<text class="ef-label ef-strong" x="176" y="122">Write: TK + time</text>' +
'</svg>'
    },

    /* Recovery position \u2014 side view: lying on their side, hand under the
       cheek, top knee bent to stop them rolling, head tilted back. */
    recovery: {
      caption: 'On their side, hand under the cheek, top knee bent to stop them rolling, head tilted back so fluid can drain.',
      svg:
'<svg viewBox="0 0 260 130" role="img" aria-label="Recovery position: on their side, top knee bent, head tilted back">' +
  '<line class="ef-ground" x1="6" y1="116" x2="254" y2="116"/>' +
  // head (tilted back) + mouth pointing down/out
  '<circle class="ef-body" cx="40" cy="92" r="15"/>' +
  '<path class="ef-guide" d="M30 104 q-6 6 -12 8"/>' +
  // hand under cheek
  '<path class="ef-key" d="M30 108 q10 -4 22 0 q-8 6 -22 0 z"/>' +
  // torso lying on side
  '<path class="ef-body" d="M56 86 Q100 70 150 82 Q157 96 150 110 Q100 117 58 108 Q51 97 56 86 Z"/>' +
  // top arm: shoulder → elbow → hand under the cheek
  '<path class="ef-body" d="M72 88 L96 102 L54 107"/>' +
  // bottom arm out in front along the ground
  '<path class="ef-body" d="M70 108 Q58 112 44 114"/>' +
  // bottom leg straight
  '<path class="ef-body" d="M150 104 L236 110 Q246 111 246 114"/>' +
  // top leg bent: hip → knee forward → foot
  '<path class="ef-key-line" d="M150 86 Q172 70 196 72 Q202 92 210 108"/>' +
  '<circle class="ef-key-dot" cx="196" cy="72" r="3.5"/>' +
  '<text class="ef-label" x="182" y="60">top knee bent</text>' +
  '<text class="ef-label" x="62" y="20">head tilted back,</text>' +
  '<text class="ef-label" x="62" y="33">airway open</text>' +
  '<path class="ef-lead" d="M60 30 L44 74"/>' +
'</svg>'
    },
    /* BATCH2 */
    choking: {
      caption: 'Adults and children over one: fist just above the navel, pull in and up; back blows between the shoulder blades. Babies: face-down along your forearm, head lower, back blows then two-finger chest thrusts. Alternate 5 back blows and 5 thrusts. Never abdominal thrusts on a baby.',
      svg: '<svg viewBox="0 0 304 158" role="img" aria-label="Adults and children over one"><text class="ef-label ef-strong" x="70" y="14" text-anchor="middle">ADULT / CHILD over 1</text><circle class="ef-body" cx="46" cy="40" r="11"/><path class="ef-body" d="M54 50 Q74 54 80 70 L84 104 L70 106 Q62 84 52 66 Z"/><path class="ef-body" d="M72 106 L70 150 M82 104 L88 150"/><circle class="ef-key" cx="56" cy="84" r="6"/><path class="ef-keyline" d="M40 96 Q48 86 60 78"/><path class="ef-keyline" d="M54 76 L60 78 L58 72"/><text class="ef-label" x="4" y="112">fist just above</text><text class="ef-label" x="4" y="123">the navel, pull</text><text class="ef-label ef-strong" x="4" y="134">IN and UP</text><path class="ef-keyline" d="M98 44 L80 56"/><path class="ef-keyline" d="M84 52 L80 56 L86 58"/><text class="ef-label" x="92" y="30">back blows</text><text class="ef-label" x="92" y="41">between the</text><text class="ef-label" x="92" y="52">shoulder</text><text class="ef-label" x="92" y="63">blades</text><line class="ef-guide" x1="160" y1="6" x2="150" y2="154"/><text class="ef-label ef-strong" x="234" y="14" text-anchor="middle">BABY under 1</text><path class="ef-body" d="M296 70 L186 108" stroke-width="6" opacity=".45"/><ellipse class="ef-body" cx="246" cy="84" rx="30" ry="11" transform="rotate(-18 246 84)"/><circle class="ef-body" cx="206" cy="100" r="11"/><path class="ef-body" d="M272 72 L292 64 M270 80 L294 78"/><path class="ef-keyline" d="M254 44 L246 66"/><path class="ef-keyline" d="M242 62 L246 66 L250 61"/><circle class="ef-key" cx="246" cy="72" r="4"/><text class="ef-label" x="196" y="38">heel of hand</text><text class="ef-label" x="170" y="128">head LOWER than body,</text><text class="ef-label" x="170" y="139">5 back blows, then 5</text><text class="ef-label" x="170" y="150">2-finger chest thrusts</text></svg>'
    },
    epipen: {
      caption: 'Adrenaline auto-injector into the outer thigh, halfway between hip and knee. Then lie them flat with legs raised (sit up if struggling to breathe).',
      svg: '<svg viewBox="0 -14 260 156" role="img" aria-label="Adrenaline auto-injector into the outer thigh, halfway between hip and knee"><path class="ef-body" d="M30 30 Q120 18 210 34 L214 70 Q120 82 30 74 Z"/><circle class="ef-body" cx="226" cy="52" r="16"/><text class="ef-label" x="226" y="90" text-anchor="middle">knee</text><text class="ef-label" x="30" y="92">hip</text><g><rect class="ef-key" x="112" y="-6" width="16" height="44" rx="5"/><rect class="ef-key2" x="114" y="-12" width="12" height="8" rx="2"/></g><path class="ef-lead" d="M120 40 L120 50"/><text class="ef-label ef-strong" x="140" y="10">OUTER thigh, halfway</text><text class="ef-label" x="140" y="22">between hip and knee</text><text class="ef-label" x="30" y="112">Through clothing is fine.</text><text class="ef-label ef-strong" x="30" y="124">Push until it clicks, hold 3 seconds.</text><text class="ef-label" x="30" y="136">No better in 5 min? Second dose if you have one.</text></svg>'
    },
    burn: {
      caption: 'Hold the burn under cool running water for 10 to 20 minutes, then cover loosely with cling film. Start as soon as possible \u2014 cooling helps most in the first 30 minutes.',
      svg: '<svg viewBox="0 0 260 146" role="img" aria-label="Hold the burn under cool running water for 10 to 20 minutes, then cover loosely with cling film"><path class="ef-body" d="M60 10 L110 10 L110 22 L96 22 L96 32 L84 32 L84 22 L60 22 Z"/><path class="ef-water" d="M86 38 q2 5 0 8 q-2 -3 0 -8 z"/><path class="ef-water" d="M90 50 q2 5 0 8 q-2 -3 0 -8 z"/><path class="ef-water" d="M84 62 q2 5 0 8 q-2 -3 0 -8 z"/><path class="ef-water" d="M89 74 q2 5 0 8 q-2 -3 0 -8 z"/><path class="ef-water" d="M86 86 q2 5 0 8 q-2 -3 0 -8 z"/><path class="ef-body" d="M10 100 Q90 90 180 96 Q196 98 200 106 Q194 116 178 116 Q90 120 10 116"/><g class="ef-wound"><ellipse cx="90" cy="104" rx="20" ry="8"/></g><text class="ef-label ef-strong" x="130" y="30">10\u201320 minutes</text><text class="ef-label" x="130" y="44">cool running water \u2014</text><text class="ef-label" x="130" y="57">cool, not icy</text><text class="ef-label" x="10" y="140">Then cover loosely with cling film. No ice, butter or creams.</text></svg>'
    },
    cold: {
      caption: 'Hypothermia: warm packs at the neck, armpits and groin; not the hands and feet first. Handle gently and keep them lying flat. No rubbing of arms and legs, no alcohol.',
      svg: '<svg viewBox="0 0 260 156" role="img" aria-label="Hypothermia"><circle class="ef-body" cx="80" cy="20.0" r="11.0"/><path class="ef-body" d="M60.0 38.0 L100.0 38.0 L97.0 94.0 L63.0 94.0 Z"/><path class="ef-body" d="M59.0 40.0 L46.0 92.0 M101.0 40.0 L114.0 92.0"/><path class="ef-body" d="M68.0 94.0 L66.0 148.0 M92.0 94.0 L94.0 148.0"/><circle class="ef-key" cx="80" cy="35.0" r="7"/><circle class="ef-key" cx="61.0" cy="46.0" r="7"/><circle class="ef-key" cx="99.0" cy="46.0" r="7"/><circle class="ef-key" cx="80" cy="94.0" r="7"/><path class="ef-cross" d="M40.0 91.0 L50.0 101.0 M50.0 91.0 L40.0 101.0"/><path class="ef-cross" d="M110.0 91.0 L120.0 101.0 M120.0 91.0 L110.0 101.0"/><path class="ef-cross" d="M60.0 146.0 L70.0 156.0 M70.0 146.0 L60.0 156.0"/><path class="ef-cross" d="M90.0 146.0 L100.0 156.0 M100.0 146.0 L90.0 156.0"/><text class="ef-label ef-strong" x="140" y="34">Warm the CORE only:</text><text class="ef-label" x="140" y="48">neck, armpits, groin \u2014</text><text class="ef-label" x="140" y="61">warm (not hot) packs</text><text class="ef-label" x="140" y="74">wrapped in cloth</text><text class="ef-label ef-strong" x="140" y="100">NOT hands and feet first</text><text class="ef-label" x="140" y="113">\u2014 cold blood rushes to</text><text class="ef-label" x="140" y="126">the heart ("afterdrop")</text></svg>'
    },
    heat: {
      caption: 'Heat stroke: cold packs at the neck, armpits and groin, soak the clothes and fan hard \u2014 or immerse in cool water. Keep cooling until they are thinking clearly again. Move them to shade first.',
      svg: '<svg viewBox="0 0 260 156" role="img" aria-label="Heat stroke"><circle class="ef-body" cx="80" cy="20.0" r="11.0"/><path class="ef-body" d="M60.0 38.0 L100.0 38.0 L97.0 94.0 L63.0 94.0 Z"/><path class="ef-body" d="M59.0 40.0 L46.0 92.0 M101.0 40.0 L114.0 92.0"/><path class="ef-body" d="M68.0 94.0 L66.0 148.0 M92.0 94.0 L94.0 148.0"/><circle class="ef-water" cx="80" cy="35.0" r="7"/><circle class="ef-water" cx="61.0" cy="46.0" r="7"/><circle class="ef-water" cx="99.0" cy="46.0" r="7"/><circle class="ef-water" cx="80" cy="94.0" r="7"/><path class="ef-water" d="M60 70 q3 6 0 9 q-3 -3 0 -9 z"/><path class="ef-water" d="M100 64 q3 6 0 9 q-3 -3 0 -9 z"/><path class="ef-water" d="M72 110 q3 6 0 9 q-3 -3 0 -9 z"/><path class="ef-water" d="M92 100 q3 6 0 9 q-3 -3 0 -9 z"/><path class="ef-keyline" d="M150 140 L130 120 M150 130 L128 112 M150 120 L132 104"/><text class="ef-label ef-strong" x="140" y="34">Cold packs or ice at the</text><text class="ef-label ef-strong" x="140" y="48">neck, armpits, groin</text><text class="ef-label" x="140" y="72">Best: lie them in cool</text><text class="ef-label" x="140" y="85">water. Otherwise soak</text><text class="ef-label" x="140" y="98">their clothes and fan hard</text></svg>'
    },
    stroke: {
      caption: 'FAST stroke check: face drooping on one side, one arm drifting down, slurred or strange speech, time to act. Any one sign is enough. Note the time it started.',
      svg: '<svg viewBox="0 0 300 126" role="img" aria-label="FAST stroke check"><rect class="ef-panel" x="4" y="4" width="68" height="118" rx="8"/><text class="ef-label ef-strong" x="38" y="22" text-anchor="middle">F \u00b7 Face</text><text class="ef-label" x="38" y="104" text-anchor="middle">one side</text><text class="ef-label" x="38" y="115" text-anchor="middle">droops</text><circle class="ef-body" cx="38" cy="62" r="22"/><circle class="ef-guide-dot" cx="30" cy="56" r="2.5"/><circle class="ef-guide-dot" cx="46" cy="57" r="2.5"/><path class="ef-keyline" d="M27 70 Q38 72 43 74 Q47 77 49 82"/><rect class="ef-panel" x="78" y="4" width="68" height="118" rx="8"/><text class="ef-label ef-strong" x="112" y="22" text-anchor="middle">A \u00b7 Arms</text><text class="ef-label" x="112" y="104" text-anchor="middle">one drifts</text><text class="ef-label" x="112" y="115" text-anchor="middle">down</text><circle class="ef-body" cx="112" cy="38" r="8"/><path class="ef-body" d="M102 48 L122 48 L120 92 L104 92 Z"/><path class="ef-body" d="M102 52 L82 52"/><path class="ef-keyline" d="M122 52 L140 66"/><rect class="ef-panel" x="152" y="4" width="68" height="118" rx="8"/><text class="ef-label ef-strong" x="186" y="22" text-anchor="middle">S \u00b7 Speech</text><text class="ef-label" x="186" y="104" text-anchor="middle">slurred or</text><text class="ef-label" x="186" y="115" text-anchor="middle">strange</text><path class="ef-body" d="M162 40 h48 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 h-30 l-10 10 v-10 h-8 a6 6 0 0 1 -6 -6 v-24 a6 6 0 0 1 6 -6 z"/><path class="ef-keyline" d="M168 58 l6 -8 l6 12 l6 -10 l6 8 l6 -6 l6 6"/><rect class="ef-panel" x="226" y="4" width="68" height="118" rx="8"/><text class="ef-label ef-strong" x="260" y="22" text-anchor="middle">T \u00b7 Time</text><text class="ef-label" x="260" y="104" text-anchor="middle">note it,</text><text class="ef-label" x="260" y="115" text-anchor="middle">act now</text><circle class="ef-body" cx="260" cy="62" r="24"/><path class="ef-keyline" d="M260 62 L260 46 M260 62 L272 68"/></svg>'
    },
    sugar: {
      caption: 'Low blood sugar: four glucose tablets, a small glass of juice, or a tablespoon of honey or sugar; wait 15 minutes and repeat if still shaky. Each is roughly 15 g of fast sugar. Follow with a proper snack once better.',
      svg: '<svg viewBox="0 0 316 126" role="img" aria-label="Low blood sugar"><circle class="ef-key" cx="18" cy="44" r="6"/><circle class="ef-key" cx="32" cy="44" r="6"/><circle class="ef-key" cx="46" cy="44" r="6"/><circle class="ef-key" cx="60" cy="44" r="6"/><text class="ef-label" x="39" y="74" text-anchor="middle">4 glucose</text><text class="ef-label" x="39" y="86" text-anchor="middle">tablets</text><text class="ef-label" x="80" y="48" text-anchor="middle">or</text><path class="ef-body" d="M104 24 L110 64 L130 64 L136 24"/><path class="ef-key" d="M107 44 L110 63 L130 63 L133 44 Z"/><text class="ef-label" x="120" y="74" text-anchor="middle">small glass</text><text class="ef-label" x="120" y="86" text-anchor="middle">of fruit juice</text><text class="ef-label" x="160" y="48" text-anchor="middle">or</text><ellipse class="ef-key" cx="186" cy="44" rx="14" ry="8"/><path class="ef-body" d="M200 44 L224 40"/><text class="ef-label" x="200" y="74" text-anchor="middle">1 tablespoon</text><text class="ef-label" x="200" y="86" text-anchor="middle">honey or sugar</text><circle class="ef-body" cx="276" cy="44" r="16"/><path class="ef-keyline" d="M276 44 L276 34 M276 44 L284 48"/><text class="ef-label" x="276" y="74" text-anchor="middle">wait 15 min,</text><text class="ef-label" x="276" y="86" text-anchor="middle">repeat if needed</text><text class="ef-label" x="4" y="110">Only if awake and able to swallow. Unconscious: nothing by mouth \u2014</text><text class="ef-label" x="4" y="122">honey or glucose gel rubbed inside the cheek, and on their side.</text></svg>'
    },
    fracture: {
      caption: 'Splint a broken forearm on a padded rigid board that covers the elbow and the wrist, tied above and below the break. Splint it in the position you found it. Bone through the skin: cover it with a clean damp cloth.',
      svg: '<svg viewBox="0 0 262 156" role="img" aria-label="Splint a broken forearm on a padded rigid board that covers the elbow and the wrist, tied above and below the break"><path class="ef-body" d="M10 52 Q60 46 110 50 L224 56 Q240 56 248 64 Q240 72 224 72 L110 76 Q60 80 10 76"/><g class="ef-wound"><path d="M162 54 l6 8 l-6 6 l6 8" fill="none"/></g><text class="ef-label" x="165" y="46" text-anchor="middle">break</text><rect class="ef-key" x="86" y="80" width="174" height="10" rx="2"/><text class="ef-label" x="173" y="104" text-anchor="middle">rigid splint, padded</text><path class="ef-keyline" d="M100 46 L100 92"/><path class="ef-keyline" d="M138 46 L138 92"/><path class="ef-keyline" d="M196 46 L196 92"/><path class="ef-keyline" d="M236 46 L236 92"/><text class="ef-label" x="110" y="20" text-anchor="middle">covers the elbow</text><text class="ef-label" x="110" y="32" text-anchor="middle">(joint above)</text><text class="ef-label" x="236" y="20" text-anchor="middle">and wrist</text><text class="ef-label" x="236" y="32" text-anchor="middle">(joint below)</text><text class="ef-label" x="10" y="124">Ties above and below the break, never on it.</text><text class="ef-label ef-strong" x="10" y="137">Check pulse, feeling and movement before</text><text class="ef-label ef-strong" x="10" y="150">and after \u2014 lost? Loosen the ties.</text></svg>'
    },
    snake: {
      caption: 'Snakebite: mark the edge of the swelling with a pen and the time, and repeat every 15 to 30 minutes; keep the limb still and below the heart. How fast the line moves tells you how urgent it is. Get to antivenom.',
      svg: '<svg viewBox="0 0 262 152" role="img" aria-label="Snakebite"><path class="ef-body" d="M10 40 Q90 34 170 44 L230 58 Q246 62 250 72 Q244 80 228 78 L168 72 Q90 80 10 76"/><circle class="ef-redfill" cx="186" cy="60" r="2.5"/><circle class="ef-redfill" cx="194" cy="62" r="2.5"/><text class="ef-label" x="190" y="98" text-anchor="middle">bite</text><path class="ef-guide" d="M150 40 Q140 58 150 76"/><text class="ef-label ef-strong" x="126" y="26" text-anchor="middle">pen line + time</text><path class="ef-guide" d="M120 38 Q110 58 120 78" opacity=".6"/><text class="ef-label" x="150" y="92" text-anchor="middle">14:05</text><text class="ef-label" x="118" y="92" text-anchor="middle">14:35</text><text class="ef-label" x="10" y="120">Keep the limb still and below heart level.</text><text class="ef-label" x="10" y="133">Rings and watches off before it swells.</text><text class="ef-label ef-strong" x="10" y="146">No cutting, sucking, tourniquet, ice or alcohol.</text></svg>'
    },
    poison: {
      caption: 'Poisoning by route: swallowed \u2014 rinse the mouth, do not make them vomit; breathed in \u2014 fresh air; skin or eyes \u2014 rinse with running water for 15 to 20 minutes. Generators, barbecues and stoves go outdoors only. Keep the container or plant.',
      svg: '<svg viewBox="0 0 300 148" role="img" aria-label="Poisoning by route"><rect class="ef-panel" x="4" y="4" width="68" height="104" rx="8"/><text class="ef-label ef-strong" x="38" y="20" text-anchor="middle">SWALLOWED</text><text class="ef-label ef-sm" x="38" y="76" text-anchor="middle">rinse mouth</text><text class="ef-label ef-sm" x="38" y="87" text-anchor="middle">DON\'T make</text><text class="ef-label ef-sm" x="38" y="98" text-anchor="middle">them sick</text><path class="ef-body" d="M22 50 Q38 66 54 50 Q38 56 22 50 Z"/><rect class="ef-panel" x="78" y="4" width="68" height="104" rx="8"/><text class="ef-label ef-strong" x="112" y="20" text-anchor="middle">FUMES</text><text class="ef-label ef-sm" x="112" y="76" text-anchor="middle">fresh air</text><text class="ef-label ef-sm" x="112" y="87" text-anchor="middle">first</text><path class="ef-guide" d="M94 40 q9 -6 18 0 t18 0"/><path class="ef-guide" d="M94 49 q9 -6 18 0 t18 0"/><path class="ef-guide" d="M94 58 q9 -6 18 0 t18 0"/><rect class="ef-panel" x="152" y="4" width="68" height="104" rx="8"/><text class="ef-label ef-strong" x="186" y="20" text-anchor="middle">ON SKIN</text><text class="ef-label ef-sm" x="186" y="76" text-anchor="middle">clothes off,</text><text class="ef-label ef-sm" x="186" y="87" text-anchor="middle">rinse</text><text class="ef-label ef-sm" x="186" y="98" text-anchor="middle">15\u201320 min</text><path class="ef-body" d="M172 64 L172 40 Q186 34 200 40 L200 64"/><path class="ef-water" d="M180 28 q2 4 0 6 q-2 -2 0 -6 z"/><path class="ef-water" d="M186 30 q2 4 0 6 q-2 -2 0 -6 z"/><path class="ef-water" d="M192 32 q2 4 0 6 q-2 -2 0 -6 z"/><rect class="ef-panel" x="226" y="4" width="68" height="104" rx="8"/><text class="ef-label ef-strong" x="260" y="20" text-anchor="middle">IN EYES</text><text class="ef-label ef-sm" x="260" y="76" text-anchor="middle">rinse with</text><text class="ef-label ef-sm" x="260" y="87" text-anchor="middle">running water</text><text class="ef-label ef-sm" x="260" y="98" text-anchor="middle">15\u201320 min</text><path class="ef-body" d="M242 52 Q260 36 278 52 Q260 68 242 52 Z"/><circle class="ef-guide-dot" cx="260" cy="52" r="6"/><rect class="ef-panel" x="4" y="114" width="292" height="30" rx="8"/><text class="ef-label ef-strong ef-sm" x="150" y="133" text-anchor="middle">Headaches in several people at once? Carbon monoxide \u2014 all out.</text></svg>'
    },
    head: {
      caption: 'Head injury danger signs: was knocked out, getting drowsier, worsening headache, repeated vomiting, a seizure, unequal pupils, weakness or slurred speech, fluid from the nose or ears. No alcohol or sleeping tablets \u2014 they hide these signs.',
      svg: '<svg viewBox="0 0 300 138" role="img" aria-label="Head injury danger signs"><text class="ef-label ef-strong" x="150" y="14" text-anchor="middle">ANY of these = get medical help</text><rect class="ef-panel" x="4" y="24" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="38" y="42" text-anchor="middle">was</text><text class="ef-label ef-sm" x="38" y="54" text-anchor="middle">knocked out</text><rect class="ef-panel" x="78" y="24" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="112" y="42" text-anchor="middle">getting</text><text class="ef-label ef-sm" x="112" y="54" text-anchor="middle">drowsier</text><rect class="ef-panel" x="152" y="24" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="186" y="42" text-anchor="middle">headache</text><text class="ef-label ef-sm" x="186" y="54" text-anchor="middle">getting worse</text><rect class="ef-panel" x="226" y="24" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="260" y="42" text-anchor="middle">keeps</text><text class="ef-label ef-sm" x="260" y="54" text-anchor="middle">vomiting</text><rect class="ef-panel" x="4" y="70" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="38" y="88" text-anchor="middle">has a</text><text class="ef-label ef-sm" x="38" y="100" text-anchor="middle">seizure</text><rect class="ef-panel" x="78" y="70" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="112" y="88" text-anchor="middle">unequal</text><text class="ef-label ef-sm" x="112" y="100" text-anchor="middle">pupils</text><rect class="ef-panel" x="152" y="70" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="186" y="88" text-anchor="middle">weak or</text><text class="ef-label ef-sm" x="186" y="100" text-anchor="middle">slurred speech</text><rect class="ef-panel" x="226" y="70" width="68" height="40" rx="7"/><text class="ef-label ef-sm" x="260" y="88" text-anchor="middle">fluid from</text><text class="ef-label ef-sm" x="260" y="100" text-anchor="middle">nose or ears</text><text class="ef-label" x="150" y="132" text-anchor="middle">Otherwise: someone stays with them for 24 hours.</text></svg>'
    },
    ors: {
      caption: 'Oral rehydration solution: one litre of clean boiled water, six level teaspoons of sugar, half a level teaspoon of salt. Level spoons \u2014 too much salt is dangerous, especially for children.',
      svg: '<svg viewBox="0 0 284 164" role="img" aria-label="Oral rehydration solution"><path class="ef-body" d="M14 20 L18 92 Q40 98 62 92 L66 20"/><path class="ef-water" d="M17 38 L19 90 Q40 96 61 90 L63 38 Z"/><text class="ef-label" x="40" y="112" text-anchor="middle">1 litre clean</text><text class="ef-label" x="40" y="124" text-anchor="middle">(boiled) water</text><text class="ef-label ef-strong" x="84" y="62" text-anchor="middle">+</text><ellipse class="ef-key" cx="104" cy="40" rx="10" ry="6"/><path class="ef-body" d="M114 40 L124 38"/><ellipse class="ef-key" cx="134" cy="40" rx="10" ry="6"/><path class="ef-body" d="M144 40 L154 38"/><ellipse class="ef-key" cx="164" cy="40" rx="10" ry="6"/><path class="ef-body" d="M174 40 L184 38"/><ellipse class="ef-key" cx="104" cy="66" rx="10" ry="6"/><path class="ef-body" d="M114 66 L124 64"/><ellipse class="ef-key" cx="134" cy="66" rx="10" ry="6"/><path class="ef-body" d="M144 66 L154 64"/><ellipse class="ef-key" cx="164" cy="66" rx="10" ry="6"/><path class="ef-body" d="M174 66 L184 64"/><text class="ef-label ef-strong" x="134" y="112" text-anchor="middle">6 level teaspoons</text><text class="ef-label" x="134" y="124" text-anchor="middle">sugar</text><text class="ef-label ef-strong" x="202" y="58" text-anchor="middle">+</text><path class="ef-key" d="M222 54 a10 6 0 0 0 20 0 z"/><ellipse class="ef-body" cx="232" cy="54" rx="10" ry="6"/><path class="ef-body" d="M242 54 L254 52"/><text class="ef-label ef-strong" x="238" y="112" text-anchor="middle">\u00bd level teaspoon</text><text class="ef-label" x="238" y="124" text-anchor="middle">salt</text><text class="ef-label" x="4" y="146">Stir until dissolved. Small sips often \u2014</text><text class="ef-label" x="4" y="158">keep going even if they vomit.</text></svg>'
    }
    /* /BATCH2 */
  };
  window.LastLight = window.LastLight || {};
  window.LastLight.emergencyFigs = FIGS;
})();
