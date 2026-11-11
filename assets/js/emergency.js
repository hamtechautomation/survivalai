/* The Last Light Survival Guide — Emergency mode
   ---------------------------------------------------------------
   One tap from any page: pick what's happening, get big numbered steps.
   Steps are condensed from the guide's own sections (linked at the end of
   each card) so they never disagree with the full text. Keep them short:
   people read these with shaking hands.

   NOTE FOR REVIEWERS: the CPR, Poisoning and Head injury cards come from
   medical sections 27–29, added Nov 2026 from standard lay-rescuer
   guidance and still awaiting clinician review.

   Opened by window.LastLight.openEmergency(id?) (header button, sidebar
   tile, search) or a URL hash like #sos or #sos-bleeding. */
(function () {
  'use strict';

  var CARDS = [
    {
      id: 'bleeding', title: 'Heavy bleeding', tile: 'Blood pouring or spurting', icon: 'drop', tone: 'red', fig: 'tourniquet',
      more: 'sections/medical.html#wound-care', moreLabel: 'Wound care & bleeding control',
      steps: [
        ['Press hard, right on the wound.', 'Use a cloth, clothing or your hand. Press firmly and keep pressing for 10 minutes — do not lift to look. If blood soaks through, add more cloth on top and keep pressing.'],
        ['Arm or leg still pouring? Tourniquet.', 'Put it 5–7 cm (2–3 in) above the wound, not on a joint. Tighten until the bleeding stops. Write down the time. Do not loosen it.'],
        ['No tourniquet? Improvise one.', 'A wide strip of cloth (not rope or wire), wrapped twice round the limb and tied over a stick. Twist the stick until bleeding stops, then tie the stick down so it can’t unwind.'],
        ['Deep wound in neck, groin or armpit?', 'Pack clean cloth or gauze tightly into the wound, then press hard with both hands for at least 5 minutes.'],
        ['Then treat for shock.', 'Lay them down, keep them warm, raise their legs if there’s no head, chest or spine injury. Once bleeding stops, clean and cover the wound.']
      ],
      dont: ['Don’t keep lifting the cloth to check — it restarts the bleeding.', 'Don’t pull out anything stuck in the wound — press around it.', 'Don’t remove a tourniquet once it’s on.'],
      watch: 'Shock: pale, cold, sweaty skin, fast weak pulse, confusion. Get them to help urgently.'
    },
    {
      id: 'cpr', title: 'Not breathing', tile: 'Unresponsive — start CPR', icon: 'heart', tone: 'red', fig: 'cpr', beat: true,
      more: 'sections/medical.html#cpr', moreLabel: 'CPR & resuscitation',
      steps: [
        ['Check they’re safe to reach, then shout and tap their shoulders.', 'No response? Shout for help. Send someone to call emergency services and fetch a defibrillator (AED) if one exists.'],
        ['Tilt the head back, lift the chin, check breathing for up to 10 seconds.', 'Gasping or occasional noisy breaths are NOT normal breathing — start CPR.'],
        ['Push hard and fast in the centre of the chest — 30 times.', 'Heel of one hand on the middle of the chest, other hand on top, arms straight. Push down 5–6 cm (2–2½ in), 100–120 per minute — the beat of “Stayin’ Alive”. Let the chest come fully back up.'],
        ['Give 2 rescue breaths.', 'Pinch the nose, seal your mouth over theirs, breathe for about 1 second each — watch the chest rise. If you can’t or won’t give breaths, just keep doing compressions non-stop.'],
        ['Keep going: 30 pushes, 2 breaths.', 'Don’t stop until they start breathing normally, a defibrillator or help arrives, or you’re too exhausted to continue. Swap with someone every 2 minutes if you can.']
      ],
      dont: ['Don’t stop to check for a pulse — keep going.', 'If they start breathing normally: roll them onto their side (recovery position) and keep watching their breathing.'],
      watch: 'Drowning, and children: give 5 rescue breaths first, then 30:2. Child: one hand, press a third of the chest depth. Baby: two fingers, about 4 cm. Very cold casualty: “not dead until warm and dead” — keep going.'
    },
    {
      id: 'choking', title: 'Choking', tile: 'Can’t breathe, cough or speak', icon: 'alert', tone: 'red', fig: 'choking',
      more: 'sections/medical.html#choking', moreLabel: 'Choking & airway obstruction',
      steps: [
        ['Can they cough or speak?', 'Then the airway is only partly blocked. Tell them to keep coughing hard and stay with them. Act only if the cough goes silent.'],
        ['5 back blows.', 'Bend them forward, head lower than chest. Strike firmly between the shoulder blades with the heel of your hand. Check the mouth after each.'],
        ['5 abdominal thrusts.', 'Stand behind them, arms round the waist. Fist just above the belly button, other hand over it, pull sharply in and up.'],
        ['Keep alternating 5 and 5.', 'Until the object comes out or they go unconscious. Shout for help, but don’t stop.'],
        ['If they go unconscious: lower them down and start CPR.', 'Each time you open the mouth for breaths, look — remove the object only if you can see it.']
      ],
      dont: ['Never do abdominal thrusts on a baby under 1 — use 5 back blows (face-down along your forearm) and 5 chest thrusts with two fingers.', 'Don’t sweep blindly with a finger — it can push the object deeper.'],
      watch: 'Anyone given abdominal thrusts should be checked afterwards for internal injury.'
    },
    {
      id: 'allergy', title: 'Severe allergy', tile: 'Swelling, can’t breathe after a sting or food', icon: 'alert', tone: 'red', fig: 'epipen',
      more: 'sections/medical.html#anaphylaxis', moreLabel: 'Anaphylaxis & severe allergy',
      steps: [
        ['Use their adrenaline (epinephrine) auto-injector now.', 'Into the outer thigh — through clothing is fine. Hold it there for 3 seconds. This is the only treatment that works.'],
        ['Lay them flat and raise their legs.', 'If they’re struggling to breathe, let them sit up. If vomiting, lie them on their side. Never stand them up suddenly.'],
        ['No better after 5 minutes? Give a second dose', 'if another auto-injector is available.'],
        ['Antihistamine only as an extra.', 'It helps itching and hives but does not open the airway or fix blood pressure.'],
        ['Stay with them for hours.', 'Symptoms can come back 1–12 hours later.']
      ],
      dont: ['Don’t wait to see if it gets better — give adrenaline first.', 'Don’t make them stand or walk.'],
      watch: 'Signs: swelling of lips/tongue/throat, hoarse voice, wheeze, faintness, pale clammy skin — usually two body systems at once.'
    },
    {
      id: 'burn', title: 'Burn', tile: 'Fire, hot liquid, chemical', icon: 'fire', tone: 'orange', fig: 'burn',
      more: 'sections/medical.html#burns', moreLabel: 'Burns',
      steps: [
        ['Cool it under cool running water for 10–20 minutes.', 'Cool, not cold — no ice. Start as soon as possible; it helps most within 30 minutes.'],
        ['Take off rings, watches and tight clothing near the burn', 'before it swells. Leave anything stuck to the skin.'],
        ['Cover loosely with cling film or a clean non-stick dressing.', 'Not cotton wool or anything fluffy.'],
        ['Keep them warm and give sips of fluid', 'if they’re conscious and not vomiting — big burns lose a lot of fluid.']
      ],
      dont: ['No butter, toothpaste, oil, egg or creams.', 'Don’t pop blisters.', 'Don’t use ice.'],
      watch: 'Urgent if: larger than their hand, on the face, hands, feet or groin, white/charred skin, or signs of an airway burn (singed nose hair, hoarse voice) — keep them upright.'
    },
    {
      id: 'cold', title: 'Too cold', tile: 'Hypothermia — shivering, confused', icon: 'snow', tone: 'blue', fig: 'cold',
      more: 'sections/medical.html#temperature', moreLabel: 'Hypothermia & heat emergencies',
      steps: [
        ['Get them out of the wind, wet and cold.', 'Take off wet clothes. Insulate them from the ground as well as above.'],
        ['Wrap them up — head included.', 'Blankets, sleeping bag, dry clothes, shared body heat.'],
        ['Warm the core only: armpits, groin and neck.', 'Warm (not hot) bottles or packs wrapped in cloth. Not the hands and feet.'],
        ['Warm sweet drinks only if fully awake', 'and able to swallow. No alcohol.'],
        ['Handle gently and keep them lying flat.', 'Rough movement or sitting up can stop the heart in severe cases.']
      ],
      dont: ['Don’t rub arms and legs or warm them first.', 'Don’t give alcohol.'],
      watch: 'Shivering stopped, very drowsy, or unconscious = severe. If not breathing, start CPR — “not dead until warm and dead”.'
    },
    {
      id: 'heat', title: 'Too hot', tile: 'Heat stroke — hot, confused', icon: 'solar', tone: 'orange', fig: 'heat',
      more: 'sections/medical.html#temperature', moreLabel: 'Hypothermia & heat emergencies',
      steps: [
        ['Hot skin and confused or collapsed = heat stroke. It’s an emergency.', 'Pale, sweaty and weak but thinking clearly is heat exhaustion: shade, rest, fluids, legs up.'],
        ['Move them somewhere cool now.', 'Shade, water, anywhere out of the sun.'],
        ['Cool aggressively.', 'Best: put them in cool water. Otherwise soak their clothes and fan hard. Ice or cold packs on neck, armpits and groin.'],
        ['Keep cooling until they’re thinking clearly again,', 'then give cool drinks with salt and sugar (rehydration solution).']
      ],
      dont: ['Don’t give paracetamol, aspirin or ibuprofen — they don’t help and can harm.', 'Don’t make them drink if confused or vomiting.'],
      watch: 'Every minute counts — aim to bring them down within 30 minutes.'
    },
    {
      id: 'seizure', title: 'Seizure', tile: 'Fitting, shaking, jerking', icon: 'brain', tone: 'amber', fig: 'recovery',
      more: 'sections/medical.html#seizures', moreLabel: 'Seizures',
      steps: [
        ['Note the time it started.', 'Most stop on their own within 3 minutes.'],
        ['Move hard or sharp things away. Don’t hold them down.', 'Cushion their head if you can.'],
        ['When the shaking stops, roll them onto their side.', 'Recovery position — keeps the airway clear of saliva or vomit.'],
        ['Stay with them while they come round.', 'Confusion and sleepiness for 5–30 minutes is normal. No food or drink until fully alert.']
      ],
      dont: ['Never put anything in their mouth — the “swallowing the tongue” idea is a myth.', 'Don’t restrain them.'],
      watch: 'Emergency if: it lasts over 5 minutes, another starts before they recover, it’s their first ever, they’re injured, or they’re pregnant.'
    },
    {
      id: 'stroke', title: 'Stroke', tile: 'Face drooping, weak arm, slurred speech', icon: 'brain', tone: 'amber', fig: 'stroke',
      more: 'sections/medical.html#stroke', moreLabel: 'Stroke recognition',
      steps: [
        ['Check FAST.', 'Face — ask them to smile: does one side droop? Arms — raise both: does one drift down? Speech — slurred or strange? Time — any one sign: act now.'],
        ['Note the time symptoms started.', 'It decides treatment if you can reach help.'],
        ['Lay them down with head and shoulders raised a little.', 'If drowsy or unconscious, put them on their side.'],
        ['Nothing to eat or drink.', 'Swallowing is often affected.']
      ],
      dont: ['Don’t give aspirin — without a scan you can’t tell a clot from a bleed, and aspirin worsens a bleed.'],
      watch: 'If they’re diabetic, low blood sugar can look like a stroke — check sugar if you can.'
    },
    {
      id: 'sugar', title: 'Low blood sugar', tile: 'Diabetic — shaky, sweaty, confused', icon: 'food', tone: 'amber', fig: 'sugar',
      more: 'sections/medical.html#diabetic', moreLabel: 'Diabetic emergencies',
      steps: [
        ['Awake and can swallow? Give sugar now.', '4 glucose tablets, a small glass of fruit juice, or a tablespoon of honey or sugar in water.'],
        ['Wait 15 minutes. Still shaky or confused? Give the same again.', ''],
        ['Once better, give a proper snack', 'such as bread or crackers with cheese or peanut butter.'],
        ['Unconscious? Nothing by mouth.', 'Rub honey or glucose gel inside the cheek, lay them on their side. Glucagon injection if available and you know how.']
      ],
      dont: ['Don’t pour drinks into someone who can’t swallow.'],
      watch: 'If in doubt, give sugar — too much for a short while is far less dangerous than too little.'
    },
    {
      id: 'fracture', title: 'Broken bone', tile: 'Deformed, very painful limb', icon: 'firstaid', tone: 'amber', fig: 'fracture',
      more: 'sections/medical.html#fractures', moreLabel: 'Fractures & splinting',
      steps: [
        ['Stop any bleeding first.', 'Bone through the skin? Cover it with a clean damp cloth — don’t push it back.'],
        ['Check below the injury: pulse, feeling, movement.', 'Can they feel you touch their fingers or toes, and wiggle them?'],
        ['Splint it in the position you found it.', 'Something rigid (stick, board, rolled magazine) covering the joint above and below. Pad it, tie it with cloth strips.'],
        ['Check pulse, feeling and movement again.', 'Lost? The splint is too tight — loosen it.']
      ],
      dont: ['Don’t try to straighten it unless there’s no pulse below and help is far away.'],
      watch: 'A broken thigh bone can bleed heavily inside — watch for shock.'
    },
    {
      id: 'snake', title: 'Snakebite', tile: 'Bitten by a snake', icon: 'alert', tone: 'amber', fig: 'snake',
      more: 'sections/medical.html#snakebite', moreLabel: 'Snakebite & envenomation',
      steps: [
        ['Move away from the snake.', 'Don’t try to catch or kill it.'],
        ['Keep them still and calm. Keep the bitten limb still and below heart level.', 'Movement spreads venom.'],
        ['Take off rings, watches and tight clothing on that limb', 'before it swells.'],
        ['Mark the edge of the swelling with a pen and write the time.', 'Repeat every 15–30 minutes to see how fast it spreads.'],
        ['Get them to antivenom (hospital) as fast as possible.', 'It is the only real treatment.']
      ],
      dont: ['No cutting, sucking, tourniquet, ice or alcohol.'],
      watch: 'Pressure-bandaging the whole limb is only for cobra/mamba/coral/Australian snakes — never for vipers or rattlesnakes. See the full section.'
    },
    {
      id: 'poison', title: 'Poisoning', tile: 'Swallowed, breathed in, overdose', icon: 'flask', tone: 'red', fig: 'poison',
      more: 'sections/medical.html#poisoning', moreLabel: 'Poisoning & overdose',
      steps: [
        ['Keep yourself safe first.', 'Fumes or gas? Open up or get them into fresh air. Chemicals on skin? Wear gloves.'],
        ['Not breathing? Start CPR.', 'Use a cloth over their mouth for breaths if there’s poison on their lips. Breathing but drowsy: lie them on their side.'],
        ['Find out what, how much and when.', 'Keep the bottle, packet, plant or mushroom — and any vomit.'],
        ['On skin or in eyes: rinse with running water for 15–20 minutes.', 'Take off contaminated clothing first.'],
        ['Swallowed: rinse the mouth and keep them still and watched.', 'Corrosive (bleach, drain cleaner) and they can swallow: small sips of water only. Get advice from any medic, pharmacist or poison line you can reach.']
      ],
      dont: ['Don’t make them vomit — it burns twice and fuels get into the lungs.', 'No salt water, no milk “cures”, no fingers down the throat.'],
      watch: 'Headache, dizziness or sickness in several people at once = carbon monoxide: everyone into fresh air, generators and stoves outside. Paracetamol overdose can look fine for a day and still kill — get treatment.'
    },
    {
      id: 'head', title: 'Head injury', tile: 'Knocked out, fall, blow to the head', icon: 'brain', tone: 'amber', fig: 'head',
      more: 'sections/medical.html#head-injury', moreLabel: 'Head injury & concussion',
      steps: [
        ['Knocked out, fell from height, or neck pain? Keep the head and neck still.', 'Don’t move them unless you must to keep them breathing.'],
        ['Unresponsive? Airway first.', 'Not breathing → CPR. Breathing → keep the airway open; if you must roll them, move head, neck and body together.'],
        ['Stop scalp bleeding with firm pressure.', 'If the skull feels soft or dented, press around the edges, not on it.'],
        ['Cold pack on a bump for 10–20 minutes.', 'Wrapped in cloth.'],
        ['Someone stays with them for 24 hours.', 'Check they behave normally and wake easily. Paracetamol for pain — no aspirin, ibuprofen, alcohol or sleeping pills.']
      ],
      dont: ['Don’t leave them alone tonight.', 'Don’t give alcohol or sedatives — they hide the warning signs.'],
      watch: 'Danger signs: was knocked out, getting drowsier, worse headache, repeated vomiting, a seizure, unequal pupils, weakness or slurred speech, clear fluid from nose or ears. Get them to medical care.'
    },
    {
      id: 'dehydration', title: 'Diarrhoea & dehydration', tile: 'Can’t keep fluids in', icon: 'water', tone: 'blue', fig: 'ors',
      more: 'quick-reference.html', moreLabel: 'Emergency Card (rehydration recipe)',
      steps: [
        ['Make rehydration solution.', '1 litre of clean (boiled) water + 6 level teaspoons sugar + ½ level teaspoon salt. Stir until dissolved.'],
        ['Give small sips, often — even if they vomit.', 'Adults about 200–400 ml an hour. Keep breastfeeding babies.'],
        ['Keep going until they pass pale urine regularly.', 'Keep eating simple food once they can.'],
        ['Make sure drinking water is safe.', 'Rolling boil for 1 minute (3 at altitude), or 8 drops of 6% bleach per gallon (2 per litre), wait 30 minutes.']
      ],
      dont: ['Don’t add extra salt — too much is dangerous, especially for children.'],
      watch: 'Danger signs: no urine for 8+ hours, very sleepy or confused, sunken eyes, blood in stools, or a baby that won’t feed.'
    }
  ];

  var ICON = function (n) { return (window.ICONS && window.ICONS[n]) || ''; };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var base = /\/(sections|pdfs)\//.test(location.pathname) ? '../' : '';

  var root, lastFocus;
  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'sos no-print';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'sos-h');
    root.innerHTML =
      '<div class="sos-bar">' +
        '<button type="button" class="sos-back" hidden aria-label="All emergencies">' + ICON('back') + '<span>All emergencies</span></button>' +
        '<h2 class="sos-h" id="sos-h">' + ICON('alert') + '<span>Emergency</span></h2>' +
        '<button type="button" class="sos-close" aria-label="Close emergency mode">' + ICON('x') + '</button>' +
      '</div>' +
      '<div class="sos-body" tabindex="-1"></div>';
    document.body.appendChild(root);
    root.querySelector('.sos-close').addEventListener('click', close);
    root.querySelector('.sos-back').addEventListener('click', function () { show(null); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (!root.querySelector('.sos-back').hidden) show(null); else close(); }
    });
    window.addEventListener('hashchange', fromHash);
  }
  function picker() {
    return '<p class="sos-call"><strong>Call for help if you can</strong> — 999 (UK) · 112 (EU) · 911 (US). Then pick what’s happening:</p>' +
      '<div class="sos-grid">' + CARDS.map(function (c) {
        return '<button type="button" class="sos-tile sos-' + c.tone + '" data-sos="' + c.id + '">' +
          '<span class="sos-ti">' + ICON(c.icon === 'drop' ? 'water' : c.icon) + '</span>' +
          '<span class="sos-tt">' + esc(c.title) + '</span><span class="sos-ts">' + esc(c.tile) + '</span></button>';
      }).join('') + '</div>' +
      '<p class="sos-foot"><a href="' + base + 'print-essentials.html">Print all of these</a> · <a href="' + base + 'quick-reference.html">Printable Emergency Card</a> · These steps are a summary — not a substitute for training.</p>';
  }
  function figure(c) {
    var F = (window.LastLight && window.LastLight.emergencyFigs) || {};
    var f = c.fig && F[c.fig];
    return f ? '<figure class="ef">' + f.svg + '<figcaption>' + esc(f.caption) + '</figcaption></figure>' : '';
  }
  function card(c) {
    return '<article class="sos-card sos-' + c.tone + '">' +
      '<h3 class="sos-title">' + esc(c.title) + '</h3>' +
      (c.beat ? '<div class="cpr-beat-host"></div>' : '') +
      '<ol class="sos-steps">' + c.steps.map(function (s) {
        return '<li><strong>' + esc(s[0]) + '</strong>' + (s[1] ? ' <span>' + esc(s[1]) + '</span>' : '') + '</li>';
      }).join('') + '</ol>' +
      figure(c) +
      (c.dont && c.dont.length ? '<div class="sos-dont"><h4>' + ICON('stop') + 'Do not</h4><ul>' + c.dont.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div>' : '') +
      (c.watch ? '<div class="sos-watch"><h4>' + ICON('info') + 'Watch for</h4><p>' + esc(c.watch) + '</p></div>' : '') +
      '<a class="sos-more" href="' + base + c.more + '">Full detail: ' + esc(c.moreLabel) + ' →</a>' +
      '</article>';
  }
  /* ── CPR beat guide ─────────────────────────────────────────────────
     Pulses at 110 a minute and counts 30 compressions, then "2 breaths",
     then repeats. Optional click sound. Keeps the screen awake while it
     runs (Wake Lock), so the phone doesn't sleep mid-CPR. */
  var beat = null;
  function stopBeat() {
    if (!beat) return;
    clearInterval(beat.timer); clearTimeout(beat.pause);
    if (beat.lock) { try { beat.lock.release(); } catch (e) {} }
    if (beat.host) {
      beat.host.classList.remove('running');
      var b = beat.host.querySelector('.cpr-start'); if (b) b.textContent = 'Start beat guide';
      beat.host.querySelector('.cpr-count').textContent = '30';
      beat.host.querySelector('.cpr-phase').textContent = 'pushes, then 2 breaths';
    }
    beat = null;
  }
  function tick(freq, ms) {
    if (!beat || !beat.sound) return;
    try {
      var ac = beat.ac || (beat.ac = new (window.AudioContext || window.webkitAudioContext)());
      var o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = freq; o.type = 'square';
      g.gain.setValueAtTime(0.12, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + ms / 1000);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + ms / 1000);
    } catch (e) {}
  }
  function mountBeat(host) {
    host.innerHTML =
      '<div class="cpr-beat">' +
        '<div class="cpr-dial" aria-hidden="true"><span class="cpr-ring"></span><span class="cpr-count">30</span></div>' +
        '<div class="cpr-side">' +
          '<p class="cpr-phase" aria-live="polite">pushes, then 2 breaths</p>' +
          '<button type="button" class="cpr-start">Start beat guide</button>' +
          '<label class="cpr-sound"><input type="checkbox"> Click sound</label>' +
        '</div>' +
      '</div>';
    var btn = host.querySelector('.cpr-start'), count = host.querySelector('.cpr-count'),
        phase = host.querySelector('.cpr-phase'), dial = host.querySelector('.cpr-dial'),
        snd = host.querySelector('.cpr-sound input');
    snd.addEventListener('change', function () { if (beat) beat.sound = snd.checked; });
    btn.addEventListener('click', function () {
      if (beat) { stopBeat(); return; }
      beat = { host: host, n: 0, sound: snd.checked };
      host.classList.add('running');
      btn.textContent = 'Stop';
      if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (l) { if (beat) beat.lock = l; else l.release(); }).catch(function () {});
      function pushes() {
        beat.n = 0; phase.textContent = 'Push hard and fast';
        beat.timer = setInterval(function () {
          if (!beat) return;
          beat.n++;
          count.textContent = beat.n;
          dial.classList.remove('hit'); void dial.offsetWidth; dial.classList.add('hit');
          tick(beat.n === 30 ? 1320 : 880, 45);
          if (beat.n >= 30) {
            clearInterval(beat.timer);
            phase.textContent = 'Give 2 breaths';
            count.textContent = '2';
            host.classList.add('breaths');
            beat.pause = setTimeout(function () { if (!beat) return; host.classList.remove('breaths'); pushes(); }, 5000);
          }
        }, 545);                                   // 110 per minute
      }
      pushes();
    });
  }

  function show(id) {
    var c = null;
    for (var i = 0; i < CARDS.length; i++) if (CARDS[i].id === id) c = CARDS[i];
    var body = root.querySelector('.sos-body');
    stopBeat();
    body.innerHTML = c ? card(c) : picker();
    var bh = body.querySelector('.cpr-beat-host'); if (bh) mountBeat(bh);
    root.querySelector('.sos-back').hidden = !c;
    root.classList.toggle('is-card', !!c);
    root.querySelector('.sos-h span').textContent = c ? c.title : 'Emergency';
    body.scrollTop = 0;
    [].forEach.call(body.querySelectorAll('[data-sos]'), function (b) { b.addEventListener('click', function () { show(b.dataset.sos); }); });
    [].forEach.call(body.querySelectorAll('.sos-more, .sos-foot a'), function (a) { a.addEventListener('click', function () { close(true); }); });
    try { history.replaceState(null, '', '#sos' + (c ? '-' + c.id : '')); } catch (e) {}
    (c ? root.querySelector('.sos-back') : body.querySelector('.sos-tile')).focus({ preventScroll: true });
  }
  function open(id) {
    build();
    if (root.hidden) lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('sos-open');
    var sb = document.getElementById('sidebar');
    if (sb && sb.classList.contains('open')) { var ov = document.getElementById('overlay'); if (ov) ov.click(); }
    show(id || null);
  }
  function close(keepHash) {
    if (!root || root.hidden) return;
    stopBeat();
    root.hidden = true;
    document.documentElement.classList.remove('sos-open');
    if (keepHash !== true) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function fromHash() {
    var m = /^#sos(?:-([a-z]+))?$/.exec(location.hash);
    if (m) open(m[1]);
  }

  window.LastLight = window.LastLight || {};
  window.LastLight.openEmergency = open;
  window.LastLight.emergencyData = CARDS;          // full cards, for print-essentials.html
  window.LastLight.emergencyCards = CARDS.map(function (c) { return { id: c.id, title: c.title, tile: c.tile }; });
  fromHash();
})();
