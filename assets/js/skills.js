/* =====================================================================
   THE LAST LIGHT SURVIVAL GUIDE
   skills.js — Practical Skills interactive UI
   Requires: shared-progress.js, skills-data.js (loaded before this)
   ===================================================================== */
(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────────────
  let activeCategory = 'all';
  let activeSkill    = null;   // skill object
  let activeStep     = 0;      // 0 = overview, 1..N = steps, N+1 = complete
  let timerInterval  = null;
  let timerRemaining = 0;
  let metroInterval  = null;
  let metroCount     = 0;

  const ALL_IDS = SKILLS.map(s => s.id);

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildCatIcons();
    renderBanner();
    renderTabs();
    renderGrid();
    bindModal();
    checkExportReminder();
  });

  // ── Progress Banner ───────────────────────────────────────────────────────
  function renderBanner() {
    var el = document.getElementById('progress-banner');
    if (!el) return;
    var sp = (typeof SharedProgress !== 'undefined') ? SharedProgress : null;
    var practices = sp ? ALL_IDS.reduce(function(s,id){ return s + sp.getPracticeCount(id); }, 0) : 0;
    var competent = sp ? ALL_IDS.filter(function(id){
      var c = sp.getCompetency(id);
      return c === 'competent' || c === 'can-teach';
    }).length : 0;

    var lastExport = sp ? sp.getLastExportDate() : '';
    var warnExport = false;
    if (lastExport) {
      var days = Math.floor((Date.now() - new Date(lastExport).getTime()) / 86400000);
      warnExport = days > 7;
    }

    el.innerHTML =
      '<span class="pb-stat"><strong>' + practices + '</strong>&nbsp;practice sessions logged</span>' +
      '<span class="pb-divider"></span>' +
      '<span class="pb-stat">✓ <strong>' + competent + '&nbsp;/&nbsp;' + ALL_IDS.length + '</strong>&nbsp;skills competent</span>' +
      (warnExport ? '<span class="pb-export-warn">&#9888; Last backup &gt;7 days ago</span>' : '') +
      '<button class="pb-btn" onclick="skillsExport()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;display:inline;vertical-align:middle;margin-right:4px"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Export Backup</button>';
  }

  window.skillsExport = function () {
    if (typeof SharedProgress !== 'undefined') SharedProgress.exportAll();
  };

  // ── Category Tabs ─────────────────────────────────────────────────────────
  var ALL_CAT_ICONS = {
    'all':          function(I){ return I.grid4;    },
    'fire':         function(I){ return I.fire;     },
    'knots':        function(I){ return I.knot;     },
    'navigation':   function(I){ return I.compass;  },
    'first-aid':    function(I){ return I.firstaid; },
    'hunting':      function(I){ return I.hunting;  },
    'plants':       function(I){ return I.leaf;     },
    'construction': function(I){ return I.axe;      },
  };

  function renderTabs() {
    var el = document.getElementById('category-tabs');
    if (!el) return;
    var I = window.ICONS || {};
    el.innerHTML = SKILLS_CATEGORIES.map(function (c) {
      var count = c.id === 'all' ? SKILLS.length : SKILLS.filter(function(s){ return s.category === c.id; }).length;
      var icon = ALL_CAT_ICONS[c.id] ? (ALL_CAT_ICONS[c.id](I) || '') : '';
      return '<button class="cat-tab' + (c.id === activeCategory ? ' active' : '') +
        '" onclick="skillsFilter(\'' + c.id + '\')" role="tab" aria-selected="' + (c.id === activeCategory) + '">' +
        icon + ' ' + c.label +
        (c.id !== 'all' ? ' <span style="opacity:.6;font-size:.7em">(' + count + ')</span>' : '') +
        '</button>';
    }).join('');
  }

  window.skillsFilter = function (catId) {
    activeCategory = catId;
    renderTabs();
    renderGrid();
  };

  // ── Skills Grid ───────────────────────────────────────────────────────────
  function renderGrid() {
    var el = document.getElementById('skills-grid');
    var countEl = document.getElementById('skills-count');
    if (!el) return;

    var filtered = activeCategory === 'all'
      ? SKILLS
      : SKILLS.filter(function(s){ return s.category === activeCategory; });

    if (countEl) countEl.textContent = filtered.length + ' skill' + (filtered.length !== 1 ? 's' : '');

    if (!filtered.length) {
      el.innerHTML = '<div class="skills-empty">No skills in this category.</div>';
      return;
    }

    el.innerHTML = filtered.map(function (s) { return renderCard(s); }).join('');
  }

  function diffBadge(d) {
    if (d === 'beginner')     return '<span class="badge badge-beginner"><span class="diff-dot"></span>Beginner</span>';
    if (d === 'intermediate') return '<span class="badge badge-intermediate"><span class="diff-dot"></span>Intermediate</span>';
    if (d === 'advanced')     return '<span class="badge badge-advanced"><span class="diff-dot"></span>Advanced</span>';
    return '';
  }

  function competencyBadge(id) {
    if (typeof SharedProgress === 'undefined') return '';
    var c = SharedProgress.getCompetency(id);
    var map = {
      'none': '',
      'getting-there': '<span class="badge badge-competency-getting-there">Getting There</span>',
      'competent':     '<span class="badge badge-competency-competent">&#10003; Competent</span>',
      'can-teach':     '<span class="badge badge-competency-can-teach">&#9733; Can Teach</span>',
    };
    return map[c] || '';
  }

  function practiceCount(id) {
    if (typeof SharedProgress === 'undefined') return '';
    var n = SharedProgress.getPracticeCount(id);
    return '<span class="badge badge-practice">Practised ' + n + 'x</span>';
  }

  var CAT_ICONS = {};

  function buildCatIcons() {
    var I = window.ICONS || {};
    CAT_ICONS = {
      'fire':         I.fire        || '',
      'knots':        I.knot        || '',
      'navigation':   I.compass     || '',
      'first-aid':    I.firstaid    || '',
      'hunting':      I.hunting     || '',
      'plants':       I.leaf        || '',
      'construction': I.axe         || '',
    };
  }

  function renderCard(s) {
    var notes = s.instructorNotes || {};
    var cardIcon = CAT_ICONS[s.category] || '';
    return [
      '<div class="skill-card" role="listitem">',
        '<div class="skill-card-bar cat-' + s.category + '"></div>',
        '<div class="skill-card-body">',
          '<div class="skill-card-top">',
            '<span class="skill-card-icon">' + cardIcon + '</span>',
            '<div class="skill-card-title-block">',
              '<div class="skill-card-title">' + esc(s.title) + '</div>',
              '<div class="skill-card-subtitle">Skill ' + s.id + ' · ' + esc(s.learnTime) + '</div>',
            '</div>',
          '</div>',
          '<div class="skill-card-badges">',
            diffBadge(s.difficulty),
            practiceCount(s.id),
            competencyBadge(s.id),
          '</div>',
          '<div class="skill-card-desc">' + esc(s.desc) + '</div>',
          '<div class="skill-card-actions">',
            '<button class="skill-card-btn" onclick="skillsOpen(\'' + s.id + '\')">▶ Start Guide</button>',
          '</div>',
          (notes.mistake || notes.fastTrack ? [
            '<div class="skill-card-notes">',
              '<button class="skill-card-notes-toggle" onclick="skillsToggleNotes(this)">▸ Instructor Notes</button>',
              '<div class="skill-card-notes-body">',
                (notes.mistake    ? '<p><strong>Common mistake:</strong> ' + esc(notes.mistake) + '</p>' : ''),
                (notes.fastTrack  ? '<p><strong>Fast track:</strong> ' + esc(notes.fastTrack) + '</p>' : ''),
                (notes.adaptations? '<p><strong>Adaptations:</strong> ' + esc(notes.adaptations) + '</p>' : ''),
              '</div>',
            '</div>',
          ].join('') : ''),
        '</div>',
      '</div>',
    ].join('');
  }

  window.skillsToggleNotes = function (btn) {
    var body = btn.nextElementSibling;
    var open = body.classList.toggle('open');
    btn.textContent = (open ? '▾' : '▸') + ' Instructor Notes';
  };

  // ── Modal ─────────────────────────────────────────────────────────────────
  function bindModal() {
    document.getElementById('sm-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (!activeSkill) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') skillsStepNav(1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   skillsStepNav(-1);
      if (e.key === 'Escape') closeModal();
    });
  }

  window.skillsOpen = function (id) {
    var s = SKILLS.find(function(x){ return x.id === id; });
    if (!s) return;
    activeSkill = s;
    activeStep  = 0;
    stopTimer();
    stopMetro();
    document.getElementById('step-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderStep();
  };

  function closeModal() {
    activeSkill = null;
    stopTimer();
    stopMetro();
    document.getElementById('step-modal').classList.remove('open');
    document.body.style.overflow = '';
    renderGrid(); // refresh badges
    renderBanner();
  }

  function totalSteps() {
    return activeSkill ? activeSkill.steps.length + 1 : 0; // steps + complete slide
  }

  window.skillsStepNav = function (dir) {
    if (!activeSkill) return;
    var next = activeStep + dir;
    if (next < 0) return;
    if (next > totalSteps()) return;
    stopTimer();
    stopMetro();
    activeStep = next;
    renderStep();
  };

  function renderStep() {
    if (!activeSkill) return;
    var s    = activeSkill;
    var step = s.steps[activeStep - 1]; // undefined on overview (0) and complete
    var isComplete = activeStep === totalSteps();

    // Top bar
    document.getElementById('sm-title').textContent = s.title;
    var counterText = isComplete ? 'Complete' : (activeStep === 0 ? 'Overview' : 'Step ' + activeStep + ' of ' + s.steps.length);
    document.getElementById('sm-counter').textContent = counterText;

    // Progress bar
    var pct = isComplete ? 100 : Math.round((activeStep / (totalSteps())) * 100);
    document.getElementById('sm-progress-fill').style.width = pct + '%';

    // Nav buttons
    var prevBtn = document.getElementById('sm-prev');
    var nextBtn = document.getElementById('sm-next');
    prevBtn.disabled = activeStep === 0;
    nextBtn.disabled = isComplete;
    nextBtn.textContent = activeStep === s.steps.length ? 'Finish →' : 'Next →';

    // Body
    var body = document.getElementById('sm-body');
    if (activeStep === 0) {
      body.innerHTML = renderOverview(s);
    } else if (isComplete) {
      body.innerHTML = renderComplete(s);
      wireCompetency(s.id);
      wireNotes(s.id);
    } else {
      body.innerHTML = renderStepBody(s, step, activeStep);
      if (step.timer) initTimer(step.timer, step.timerLabel);
      if (s.id === '4.2' && activeStep === 6) initMetro();
    }

    body.scrollTop = 0;
  }

  function renderOverview(s) {
    var mats = s.materials.length
      ? '<ul style="margin:var(--sp-sm) 0 0;padding-left:1.5rem">' + s.materials.map(function(m){ return '<li style="color:var(--text-1);font-size:.9rem">' + esc(m) + '</li>'; }).join('') + '</ul>'
      : '';
    return [
      '<div class="sm-step-title">' + s.icon + ' ' + esc(s.title) + '</div>',
      '<div class="skill-card-badges" style="margin-bottom:var(--sp-md)">' + diffBadge(s.difficulty) + '</div>',
      '<div class="sm-instruction">' + esc(s.desc) + '</div>',
      '<div style="font-size:.8rem;color:var(--text-2);margin-bottom:var(--sp-xs)">⏱ Learn: ' + esc(s.learnTime) + '</div>',
      (s.teachTime ? '<div style="font-size:.8rem;color:var(--text-2);margin-bottom:var(--sp-md)">👥 Teach: ' + esc(s.teachTime) + '</div>' : ''),
      (s.materials.length ? '<div style="font-size:.82rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-top:var(--sp-md)">Materials needed</div>' + mats : ''),
      '<div style="margin-top:var(--sp-lg);padding:var(--sp-md);background:var(--bg-2);border:1px solid var(--border-hi);border-radius:8px;font-size:.85rem;color:var(--text-2)">',
        '<strong style="color:var(--amber)">This guide has ' + s.steps.length + ' steps.</strong> Tap Next to begin step-by-step. Or use ← → arrow keys.',
      '</div>',
    ].join('');
  }

  function renderStepBody(s, step, num) {
    var parts = [];
    parts.push('<div style="font-size:.78rem;color:var(--text-3);font-family:var(--mono);margin-bottom:.4rem">STEP ' + num + ' OF ' + s.steps.length + '</div>');
    parts.push('<div class="sm-step-title">' + esc(step.title) + '</div>');
    if (step.svg) {
      parts.push('<div class="sm-svg-wrap">' + step.svg + '</div>');
    } else if (CAT_SVG[s.category]) {
      parts.push('<div class="sm-svg-wrap" style="opacity:.25">' + CAT_SVG[s.category] + '</div>');
    }
    parts.push('<div class="sm-instruction">' + esc(step.body) + '</div>');
    if (step.warning) {
      parts.push('<div class="sm-warning"><strong>⚠ Warning</strong>' + esc(step.warning) + '</div>');
    }
    if (step.timer) {
      parts.push(renderTimer(step.timer, step.timerLabel));
    }
    if (step.tip) {
      parts.push('<div class="sm-tip"><strong>💡 Tip</strong>' + esc(step.tip) + '</div>');
    }
    // CPR metronome placeholder
    if (s.id === '4.2' && num === 6) {
      parts.push(renderMetronome());
    }
    return parts.join('');
  }

  function renderComplete(s) {
    var sp = typeof SharedProgress !== 'undefined' ? SharedProgress : null;
    var pCount = sp ? sp.getPracticeCount(s.id) : 0;
    var tCount = sp ? sp.getTaughtCount(s.id) : 0;
    var comp   = sp ? sp.getCompetency(s.id) : 'none';

    return [
      '<div class="sm-complete">',
        '<div class="sm-complete-icon">✓</div>',
        '<h2>Guide Complete</h2>',
        '<div style="color:var(--text-2);font-size:.95rem;margin-bottom:var(--sp-md)">' + esc(s.title) + '</div>',
        (s.competencyTest ? '<div style="background:var(--bg-2);border:1px solid var(--border-hi);border-radius:8px;padding:var(--sp-md);margin:var(--sp-md) auto;max-width:420px;font-size:.85rem;color:var(--text-1);text-align:left"><strong style="display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:.4rem">Competency test</strong>' + esc(s.competencyTest) + '</div>' : ''),
        '<div class="sm-practice-count">Practised ' + pCount + ' time' + (pCount !== 1 ? 's' : '') + ' total</div>',
        '<div class="sm-complete-actions">',
          '<button class="sm-action-btn primary" onclick="skillsLogPractice(\'' + s.id + '\')">📋 Log Practice Session</button>',
          '<button class="sm-action-btn secondary" onclick="skillsLogTaught(\'' + s.id + '\')">👥 Mark as Taught (' + tCount + 'x)</button>',
        '</div>',
        '<div class="sm-competency">',
          '<div class="sm-competency-label">Self-rated competency</div>',
          '<div class="sm-competency-options" id="comp-opts">',
            renderCompOpts(comp, s.id),
          '</div>',
        '</div>',
        '<div class="sm-instr-notes" id="instr-notes-wrap">',
          '<button class="sm-instr-notes-toggle" onclick="skillsToggleInstrNotes()">▸ Instructor Notes (private)</button>',
          '<div class="sm-instr-notes-body" id="instr-notes-body">',
            '<textarea id="instr-notes-ta" placeholder="Notes for teaching this skill…" rows="4"></textarea>',
          '</div>',
        '</div>',
        '<div style="margin-top:var(--sp-md)">',
          '<a href="teach.html" style="font-size:.82rem;color:var(--amber);text-decoration:none">→ View Lesson Plans in Teaching Hub</a>',
        '</div>',
      '</div>',
    ].join('');
  }

  function renderCompOpts(current, id) {
    var opts = [
      { val: 'none',          label: 'Not Yet' },
      { val: 'getting-there', label: 'Getting There' },
      { val: 'competent',     label: '✓ Competent' },
      { val: 'can-teach',     label: '★ Can Teach' },
    ];
    return opts.map(function (o) {
      return '<button class="sm-comp-opt' + (current === o.val ? ' selected' : '') +
        '" onclick="skillsSetComp(\'' + id + '\',\'' + o.val + '\')">' + o.label + '</button>';
    }).join('');
  }

  function wireCompetency(id) { /* options wired via onclick attrs */ }
  function wireNotes(id) {
    var sp = typeof SharedProgress !== 'undefined' ? SharedProgress : null;
    if (!sp) return;
    setTimeout(function () {
      var ta = document.getElementById('instr-notes-ta');
      if (!ta) return;
      ta.value = sp.getLessonPlanNotes(id);
      ta.addEventListener('input', function () {
        sp.setLessonPlanNotes(id, ta.value);
      });
    }, 50);
  }

  window.skillsToggleInstrNotes = function () {
    var body = document.getElementById('instr-notes-body');
    var btn  = document.querySelector('.sm-instr-notes-toggle');
    if (!body || !btn) return;
    var open = body.classList.toggle('open');
    btn.textContent = (open ? '▾' : '▸') + ' Instructor Notes (private)';
  };

  window.skillsLogPractice = function (id) {
    if (typeof SharedProgress === 'undefined') return;
    var n = SharedProgress.incrementPractice(id);
    document.querySelector('.sm-practice-count').textContent = 'Practised ' + n + ' time' + (n !== 1 ? 's' : '') + ' total';
    flashGreen(document.querySelector('.sm-action-btn.primary'));
  };

  window.skillsLogTaught = function (id) {
    if (typeof SharedProgress === 'undefined') return;
    var n = SharedProgress.incrementTaught(id);
    var btn = document.querySelector('.sm-action-btn.secondary');
    if (btn) btn.textContent = '👥 Mark as Taught (' + n + 'x)';
    flashGreen(btn);
  };

  window.skillsSetComp = function (id, level) {
    if (typeof SharedProgress !== 'undefined') SharedProgress.setCompetency(id, level);
    var opts = document.getElementById('comp-opts');
    if (opts) opts.innerHTML = renderCompOpts(level, id);
  };

  // ── Timer ──────────────────────────────────────────────────────────────────
  function renderTimer(seconds, label) {
    return [
      '<div class="sm-timer" id="sm-timer-widget">',
        '<div class="sm-timer-label">' + esc(label || 'Timer') + '</div>',
        '<div class="sm-timer-display" id="sm-timer-display">' + fmtTime(seconds) + '</div>',
        '<div class="sm-timer-btns">',
          '<button class="sm-timer-btn start" id="sm-timer-start" onclick="skillsTimerStart()">▶ Start</button>',
          '<button class="sm-timer-btn" onclick="skillsTimerReset()">↺ Reset</button>',
        '</div>',
      '</div>',
    ].join('');
  }

  function initTimer(seconds, label) {
    timerRemaining = seconds;
    // display already rendered by renderTimer()
  }

  window.skillsTimerStart = function () {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    var disp  = document.getElementById('sm-timer-display');
    var start = document.getElementById('sm-timer-start');
    if (!disp) return;
    disp.classList.add('running');
    if (start) start.textContent = '⏸ Pause';
    timerInterval = setInterval(function () {
      timerRemaining--;
      if (disp) disp.textContent = fmtTime(timerRemaining);
      if (timerRemaining <= 0) {
        clearInterval(timerInterval); timerInterval = null;
        disp.classList.remove('running');
        disp.classList.add('done');
        disp.textContent = '✓ Done';
        if (start) start.textContent = '▶ Start';
        timerDone();
      }
    }, 1000);
  };

  window.skillsTimerReset = function () {
    stopTimer();
    var step = activeSkill && activeSkill.steps[activeStep - 1];
    if (step && step.timer) {
      timerRemaining = step.timer;
      var disp = document.getElementById('sm-timer-display');
      if (disp) { disp.textContent = fmtTime(timerRemaining); disp.classList.remove('running','done'); }
      var start = document.getElementById('sm-timer-start');
      if (start) start.textContent = '▶ Start';
    }
  };

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function timerDone() {
    // Audio cue — 3 short beeps via Web Audio API
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach(function (t) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.18);
      });
    } catch (e) {}
  }

  function fmtTime(s) {
    s = Math.max(0, s);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // ── CPR Metronome ─────────────────────────────────────────────────────────
  function renderMetronome() {
    return [
      '<div class="sm-metronome" id="sm-metro">',
        '<div class="sm-metro-label">CPR Metronome — 110 bpm</div>',
        '<div class="sm-metro-pulse" id="sm-metro-pulse">PUSH</div>',
        '<div class="sm-metro-count" id="sm-metro-count">0</div>',
        '<div class="sm-timer-btns">',
          '<button class="sm-timer-btn start" onclick="skillsMetroToggle()">▶ Start</button>',
          '<button class="sm-timer-btn" onclick="skillsMetroReset()">↺ Reset</button>',
        '</div>',
      '</div>',
    ].join('');
  }

  function initMetro() { metroCount = 0; }

  window.skillsMetroToggle = function () {
    if (metroInterval) { stopMetro(); return; }
    var btn = document.querySelector('#sm-metro .start');
    if (btn) btn.textContent = '⏸ Pause';
    var ms = Math.round(60000 / 110); // ~545ms per beat
    metroInterval = setInterval(function () {
      metroCount++;
      var pulse = document.getElementById('sm-metro-pulse');
      var count = document.getElementById('sm-metro-count');
      if (pulse) { pulse.classList.add('beat'); setTimeout(function(){ pulse.classList.remove('beat'); }, 120); }
      if (count) count.textContent = metroCount;
      // 30 compressions then prompt for breaths
      if (metroCount > 0 && metroCount % 30 === 0) {
        stopMetro();
        if (pulse) { pulse.textContent = 'BREATHE'; pulse.style.background = 'var(--blue-dim)'; pulse.style.borderColor = 'var(--blue)'; }
        setTimeout(function () {
          if (pulse) { pulse.textContent = 'PUSH'; pulse.style.background = ''; pulse.style.borderColor = ''; }
          var startBtn = document.querySelector('#sm-metro .start');
          if (startBtn) startBtn.textContent = '▶ Start';
        }, 3500);
      }
    }, ms);
  };

  window.skillsMetroReset = function () {
    stopMetro();
    metroCount = 0;
    var count = document.getElementById('sm-metro-count');
    if (count) count.textContent = '0';
    var btn = document.querySelector('#sm-metro .start');
    if (btn) btn.textContent = '▶ Start';
    var pulse = document.getElementById('sm-metro-pulse');
    if (pulse) { pulse.textContent = 'PUSH'; pulse.style.background = ''; pulse.style.borderColor = ''; }
  };

  function stopMetro() {
    if (metroInterval) { clearInterval(metroInterval); metroInterval = null; }
    var btn = document.querySelector('#sm-metro .start');
    if (btn) btn.textContent = '▶ Start';
  }

  // ── Print ─────────────────────────────────────────────────────────────────
  window.skillsPrintCurrent = function () {
    if (!activeSkill) { window.print(); return; }
    // Replace modal body with all-steps print layout
    var s = activeSkill;
    var body = document.getElementById('sm-body');
    var prevHTML = body.innerHTML;
    var prevStep = activeStep;

    body.innerHTML = [
      '<div class="print-all-steps" style="padding:0">',
        '<h2 style="margin-bottom:var(--sp-md)">' + s.icon + ' ' + esc(s.title) + ' — Skill ' + s.id + '</h2>',
        '<p style="color:var(--text-2);margin-bottom:var(--sp-md)">' + esc(s.desc) + '</p>',
        s.steps.map(function (step, i) {
          return [
            '<div class="print-step">',
              '<h3>Step ' + (i + 1) + ': ' + esc(step.title) + '</h3>',
              (step.svg ? '<div style="margin:var(--sp-sm) 0">' + step.svg + '</div>' : ''),
              '<p>' + esc(step.body) + '</p>',
              (step.warning ? '<p style="color:#c84848"><strong>⚠</strong> ' + esc(step.warning) + '</p>' : ''),
              (step.tip ? '<p style="color:#7a6430"><em>' + esc(step.tip) + '</em></p>' : ''),
            '</div>',
          ].join('');
        }).join(''),
        (s.competencyTest ? '<div class="print-step"><h3>Competency Test</h3><p>' + esc(s.competencyTest) + '</p></div>' : ''),
      '</div>',
    ].join('');

    window.print();

    body.innerHTML = prevHTML;
    activeStep = prevStep;
    // Rewire events if on complete slide
    if (prevStep === totalSteps() && activeSkill) {
      wireNotes(activeSkill.id);
    }
  };

  // ── Export reminder ────────────────────────────────────────────────────────
  function checkExportReminder() {
    var sp = typeof SharedProgress !== 'undefined' ? SharedProgress : null;
    if (!sp) return;
    var last = sp.getLastExportDate();
    if (!last) return;
    var days = Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
    if (days > 7) renderBanner(); // already shows the warning in banner
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function flashGreen(el) {
    if (!el) return;
    el.style.background = 'rgba(75,158,106,.35)';
    setTimeout(function () { el.style.background = ''; }, 600);
  }

})();
