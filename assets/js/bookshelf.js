/* The Last Light Survival Guide — Bookshelf view
   ---------------------------------------------------------------
   Renders any list of "books" as spines standing on a shelf.
   Hover (or focus / tap) a spine to read its blurb in a popover.

   Zero dependencies, works from file://. The original card/list
   markup stays in the DOM untouched — the shelf is a progressive
   enhancement on top of it, and the list is still what prints.

   Usage:
     Bookshelf.mount(containerEl, items, { label: 'Bundled PDFs' })
   where each item is:
     {
       title, author, desc,            // strings (plain text)
       cover,                          // optional cover image URL for the blurb
       note,                           // optional extra line (plain text)
       tags:   [{ text, tone }],       // tone: critical|important|nice|info|muted|ok
       actions:[{ text, href, download, primary }],
       hue,                            // spine colour family (see SPINE_TONES)
       size,                           // 0..1 → spine thickness (e.g. page count)
       tall,                           // 0..1 → spine height
       hidden,                         // bool — filtered out
       ribbon,                         // bool — shows a bookmark ribbon (e.g. "obtained")
       check: { label, checked, onChange } // optional checkbox in the blurb
     }
   The returned handle has .update(items) to re-sync (filters, ticks).
*/
(function () {
  'use strict';

  // Muted cloth/leather bindings that sit well on the dark green-black UI.
  var SPINE_TONES = {
    red:    ['#5a1f1c', '#7a2c26'],
    rust:   ['#5e3518', '#7e4a22'],
    olive:  ['#3b4421', '#525e2e'],
    green:  ['#1f4430', '#2c5c41'],
    teal:   ['#18403f', '#235756'],
    navy:   ['#1c2c4a', '#283d63'],
    plum:   ['#3d2440', '#553259'],
    ochre:  ['#6a5420', '#8a6e2a'],
    slate:  ['#2c3436', '#3e494c'],
    cream:  ['#8c826a', '#a89c7e']
  };
  var TONE_ORDER = Object.keys(SPINE_TONES);

  // Stable pseudo-random from a string, so a book always looks the same.
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  // ── One shared blurb popover for the whole page ──────────────────────────
  var pop, popInner, current = null, pinned = false, hideTimer = null, showTimer = null;

  function ensurePopover() {
    if (pop) return;
    pop = el('div', 'shelf-pop');
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'false');
    pop.hidden = true;
    var close = el('button', 'shelf-pop-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', function () { hide(true); });
    popInner = el('div', 'shelf-pop-inner');
    pop.appendChild(close);
    pop.appendChild(popInner);
    document.body.appendChild(pop);

    pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('mouseleave', function () { if (!pinned) scheduleHide(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) { var s = current.spine; hide(true); s.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!current) return;
      if (pop.contains(e.target) || current.spine.contains(e.target)) return;
      hide(true);
    });
    window.addEventListener('resize', function () { if (current) position(current.spine); });
    window.addEventListener('scroll', function () { if (current && !isSheet()) position(current.spine); }, { passive: true });
  }

  function isSheet() { return window.innerWidth < 700; }

  function render(item) {
    popInner.textContent = '';
    var head = el('div', 'shelf-pop-head');
    var swatch = el('span', 'shelf-pop-swatch');
    var tone = SPINE_TONES[item._tone] || SPINE_TONES.slate;
    swatch.style.background = 'linear-gradient(90deg,' + tone[0] + ',' + tone[1] + ')';
    var titles = el('div');
    var h = el('h3', 'shelf-pop-title', item.title);
    h.id = 'shelf-pop-title';
    titles.appendChild(h);
    if (item.author) titles.appendChild(el('div', 'shelf-pop-author', item.author));
    if (item.cover) {
      var img = el('img', 'shelf-pop-cover');
      img.src = item.cover; img.alt = '';
      img.onerror = function () { img.replaceWith(swatch); };
      head.appendChild(img);
    } else head.appendChild(swatch);
    head.appendChild(titles);
    popInner.appendChild(head);
    pop.setAttribute('aria-labelledby', 'shelf-pop-title');

    if (item.tags && item.tags.length) {
      var tags = el('div', 'shelf-pop-tags');
      item.tags.forEach(function (t) { tags.appendChild(el('span', 'shelf-tag shelf-tag-' + (t.tone || 'muted'), t.text)); });
      popInner.appendChild(tags);
    }
    if (item.desc) popInner.appendChild(el('p', 'shelf-pop-desc', item.desc));
    if (item.note) popInner.appendChild(el('p', 'shelf-pop-note', item.note));

    var foot = el('div', 'shelf-pop-actions');
    if (item.check) {
      var lab = el('label', 'shelf-pop-check');
      var cb = el('input');
      cb.type = 'checkbox';
      cb.checked = !!item.check.checked;
      cb.addEventListener('change', function () {
        item.check.checked = cb.checked;
        item.check.onChange(cb.checked);
      });
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(' ' + (item.check.label || 'Obtained')));
      foot.appendChild(lab);
    }
    (item.actions || []).forEach(function (a) {
      var link = el('a', 'shelf-btn' + (a.primary ? ' shelf-btn-primary' : ''), a.text);
      link.href = a.href;
      if (a.download) link.setAttribute('download', '');
      if (/^https?:/.test(a.href)) { link.target = '_blank'; link.rel = 'noopener'; }
      else if (!a.download) link.target = '_blank';
      foot.appendChild(link);
    });
    if (foot.childNodes.length) popInner.appendChild(foot);
  }

  function position(spine) {
    if (isSheet()) { pop.classList.add('is-sheet'); pop.style.left = pop.style.top = ''; return; }
    pop.classList.remove('is-sheet');
    var r = spine.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight, gap = 12;
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    // Prefer to the right of the spine, else left, else above.
    var left = r.right + gap, side = 'right';
    if (left + pw > vw - 8) { left = r.left - gap - pw; side = 'left'; }
    if (left < 8) { left = Math.max(8, Math.min(vw - pw - 8, r.left + r.width / 2 - pw / 2)); side = 'top'; }
    var top = side === 'top' ? r.top - ph - gap : r.top + r.height / 2 - ph / 2;
    if (side === 'top' && top < 8) top = r.bottom + gap;
    top = Math.max(8, Math.min(vh - ph - 8, top));
    pop.style.left = Math.round(left + window.scrollX) + 'px';
    pop.style.top = Math.round(top + window.scrollY) + 'px';
    pop.dataset.side = side;
  }

  function show(spine, item, pin) {
    ensurePopover();
    clearTimeout(hideTimer); clearTimeout(showTimer);
    if (current && current.spine !== spine) current.spine.setAttribute('aria-expanded', 'false');
    current = { spine: spine, item: item };
    pinned = !!pin;
    spine.setAttribute('aria-expanded', 'true');
    render(item);
    pop.hidden = false;
    position(spine);
    pop.classList.add('is-open');
    if (pin && isSheet()) pop.querySelector('.shelf-pop-close').focus({ preventScroll: true });
  }

  function hide(force) {
    if (!pop || !current) return;
    if (pinned && !force) return;
    current.spine.setAttribute('aria-expanded', 'false');
    current = null; pinned = false;
    pop.classList.remove('is-open');
    pop.hidden = true;
  }

  function scheduleHide() { clearTimeout(hideTimer); hideTimer = setTimeout(function () { hide(false); }, 180); }

  // ── Spine + shelf rendering ──────────────────────────────────────────────
  function buildSpine(item, idx) {
    var seed = hash(item.title || String(idx));
    var tone = item.hue && SPINE_TONES[item.hue] ? item.hue : TONE_ORDER[Math.floor(seed * TONE_ORDER.length)];
    item._tone = tone;
    var c = SPINE_TONES[tone];
    var size = item.size != null ? item.size : seed;
    var tall = item.tall != null ? item.tall : hash((item.title || '') + 'h');

    var b = el('button', 'shelf-book');
    b.type = 'button';
    b.setAttribute('aria-haspopup', 'dialog');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', item.title + (item.author ? ' — ' + item.author : '') + '. Show details');
    b.style.setProperty('--w', Math.round(30 + size * 26) + 'px');
    b.style.setProperty('--h', Math.round(150 + tall * 60) + 'px');
    b.style.setProperty('--c0', c[0]);
    b.style.setProperty('--c1', c[1]);
    // Every few books lean slightly, like a real shelf.
    if (!reduceMotion && seed > 0.86) b.classList.add('lean');

    var t = el('span', 'shelf-book-title', item.title);
    b.appendChild(t);
    if (item.spineNote) { b.classList.add('has-mark'); b.appendChild(el('span', 'shelf-book-mark', item.spineNote)); }
    if (item.ribbon) b.appendChild(el('span', 'shelf-book-ribbon'));

    b.addEventListener('mouseenter', function () {
      if (isTouch || pinned) return;
      clearTimeout(hideTimer); clearTimeout(showTimer);
      showTimer = setTimeout(function () { show(b, item, false); }, current ? 0 : 120);
    });
    b.addEventListener('mouseleave', function () { clearTimeout(showTimer); if (!pinned) scheduleHide(); });
    b.addEventListener('focus', function () { if (!pinned && b.matches(':focus-visible')) show(b, item, false); });
    b.addEventListener('blur', function (e) { if (!pinned && !(pop && pop.contains(e.relatedTarget))) scheduleHide(); });
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      if (current && current.spine === b && pinned) { hide(true); return; }
      show(b, item, true);
    });
    return b;
  }

  function mount(container, items, opts) {
    opts = opts || {};
    var root = el('div', 'shelf');
    if (opts.label) root.setAttribute('aria-label', opts.label);
    root.setAttribute('role', 'group');
    container.appendChild(root);

    function draw(list) {
      // If this shelf's blurb is open, keep it open on the re-rendered spine.
      var reopen = current && root.contains(current.spine) ? current.item.title : null;
      root.textContent = '';
      var row = el('div', 'shelf-row');
      var shown = 0;
      list.forEach(function (item, i) {
        if (item.hidden) return;
        row.appendChild(buildSpine(item, i));
        shown++;
      });
      if (!shown) {
        if (reopen) hide(true);
        root.appendChild(el('p', 'shelf-empty', opts.empty || 'No books match this filter.'));
        return;
      }
      root.appendChild(row);
      if (reopen) {
        var idx = -1;
        list.forEach(function (it, i) { if (idx < 0 && !it.hidden && it.title === reopen) idx = i; });
        var spine = idx >= 0 ? row.children[list.slice(0, idx).filter(function (it) { return !it.hidden; }).length] : null;
        if (spine) {
          current.spine = spine;
          current.item = list[idx];
          spine.setAttribute('aria-expanded', 'true');
          position(spine);
        } else hide(true);
      }
    }
    draw(items);
    return { el: root, update: draw };
  }

  // ── Shelf / List view toggle (remembered per page section) ───────────────
  function viewToggle(key, onChange, initial) {
    var stored = null;
    try { stored = localStorage.getItem('shelf-view:' + key); } catch (e) {}
    var mode = stored || initial || 'shelf';
    var wrap = el('div', 'view-toggle');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Choose view');
    function sync(m) {
      mode = m;
      wrap.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.mode === mode)); });
      onChange(mode);
    }
    [['shelf', 'Shelf'], ['list', 'List']].forEach(function (m) {
      var btn = el('button', 'view-toggle-btn', m[1]);
      btn.type = 'button';
      btn.dataset.mode = m[0];
      btn.setAttribute('aria-pressed', String(m[0] === mode));
      btn.addEventListener('click', function () {
        if (m[0] === mode) return;
        try { localStorage.setItem('shelf-view:' + key, m[0]); } catch (e) {}
        hide(true);
        // Keep every toggle sharing this key in step.
        document.dispatchEvent(new CustomEvent('shelf-view', { detail: { key: key, mode: m[0] } }));
      });
      wrap.appendChild(btn);
    });
    document.addEventListener('shelf-view', function (e) { if (e.detail.key === key) sync(e.detail.mode); });
    sync(mode);
    return wrap;
  }

  window.Bookshelf = { mount: mount, viewToggle: viewToggle, hide: function () { hide(true); } };
})();
