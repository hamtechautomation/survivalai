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
    }
  };
  window.LastLight = window.LastLight || {};
  window.LastLight.emergencyFigs = FIGS;
})();
