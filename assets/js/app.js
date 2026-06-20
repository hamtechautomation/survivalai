/* =========================================
   THE LAST LIGHT SURVIVAL GUIDE
   app.js — Navigation, print, utilities
   ========================================= */

(function () {
  'use strict';

  /* =================== CONSTANTS =================== */
  const NAV_PAGES = [
    { id: 'home',           href: 'index.html',                    icon: '🏠', label: 'Home' },
    { id: 'food',           href: 'sections/food.html',            icon: '💧', label: 'Food & Water' },
    { id: 'medical',        href: 'sections/medical.html',         icon: '🏥', label: 'Medical & First Aid' },
    { id: 'energy',         href: 'sections/energy.html',          icon: '⚡', label: 'Energy' },
    { id: 'shelter',        href: 'sections/shelter.html',         icon: '🏕️', label: 'Shelter & Construction' },
    { id: 'communications', href: 'sections/communications.html',  icon: '📻', label: 'Communications' },
    { id: 'navigation',     href: 'sections/navigation.html',      icon: '🧭', label: 'Navigation & Maps' },
    { id: 'security',       href: 'sections/security.html',        icon: '🛡️', label: 'Security & Defense' },
    { id: 'knowledge',      href: 'sections/knowledge.html',       icon: '📚', label: 'Knowledge & Literacy' },
    { id: 'agriculture',    href: 'sections/agriculture.html',     icon: '🌱', label: 'Agriculture' },
    { id: 'animal',         href: 'sections/animal.html',          icon: '🐄', label: 'Animal Husbandry' },
    { id: 'nbc',            href: 'sections/nbc.html',             icon: '☢️', label: 'NBC / EMP Threats' },
    { id: 'disasters',      href: 'sections/disasters.html',       icon: '🌪️', label: 'Disaster Playbooks' },
    { id: 'climate',        href: 'sections/climate.html',         icon: '🌍', label: 'Climate & Regional' },
    { id: 'metallurgy',     href: 'sections/metallurgy.html',      icon: '⚒️', label: 'Metallurgy' },
    { id: 'governance',     href: 'sections/governance.html',      icon: '🏛️', label: 'Governance' },
    { id: 'psychology',     href: 'sections/psychology.html',      icon: '🧠', label: 'Psychology & Morale' },
    { id: 'chemistry',      href: 'sections/chemistry.html',       icon: '🧪', label: 'Chemistry & Materials' },
    { id: 'textiles',       href: 'sections/textiles.html',        icon: '🧵', label: 'Textiles & Clothing' },
    { id: 'vehicles',       href: 'sections/vehicles.html',        icon: '🚗', label: 'Vehicles & Transport' },
    { id: 'tools',          href: 'tools.html',                    icon: '🔧', label: 'Calculators & Tools' },
    { id: 'literature',     href: 'literature.html',               icon: '📚', label: 'Reference Library' },
  ];

  /* =================== INIT =================== */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    addSkipNav();
    injectManifest();
    buildNav();
    setActiveNav();
    setupSidebar();
    setupARIAToggle();
    setupBackToTop();
    setupPrintButtons();
    setupReadingTime();
    setupLastUpdated();
    setupKeyboard();
    setupCopyCode();
    setupModeBar();
    setupServiceWorker();
    setupInstallPrompt();
    markStandalone();
  }

  /* =================== PWA MANIFEST + IOS META =================== */
  function injectManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;
    const isSection = window.location.pathname.includes('/sections/');
    const isPdfs    = window.location.pathname.includes('/pdfs/');
    const base      = (isSection || isPdfs) ? '../' : '';

    const link = document.createElement('link');
    link.rel  = 'manifest';
    link.href = `${base}manifest.json`;
    document.head.appendChild(link);

    const touch = document.createElement('link');
    touch.rel  = 'apple-touch-icon';
    touch.href = `${base}assets/icons/icon.svg`;
    document.head.appendChild(touch);

    /* iOS standalone PWA meta tags */
    const iosMeta = [
      ['apple-mobile-web-app-capable',        'yes'],
      ['apple-mobile-web-app-status-bar-style','black-translucent'],
      ['apple-mobile-web-app-title',           'Last Light'],
      ['theme-color',                          '#070a09'],
    ];
    iosMeta.forEach(([name, content]) => {
      if (document.querySelector(`meta[name="${name}"]`)) return;
      const m = document.createElement('meta');
      m.name = name; m.content = content;
      document.head.appendChild(m);
    });
  }

  /* Add class when running as installed PWA (standalone mode) */
  function markStandalone() {
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) document.documentElement.classList.add('pwa-standalone');
  }

  /* =================== SKIP NAVIGATION =================== */
  function addSkipNav() {
    if (document.getElementById('skip-nav')) return;
    const skip = document.createElement('a');
    skip.id = 'skip-nav';
    skip.href = '#main-content';
    skip.className = 'skip-nav';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* =================== NAV BUILD =================== */
  function buildNav() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    /* Resolve base path — pages in /sections/ need ../ prefix */
    const isSection = window.location.pathname.includes('/sections/');
    const base = isSection ? '../' : '';

    const headerHTML = `
      <div class="sidebar-header">
        <a href="${base}index.html" class="logo-link">
          <span class="logo-icon">⚡</span>
          <span class="logo-text-block">
            <span class="logo-text">Last Light</span>
            <span class="logo-sub">Survival Guide</span>
          </span>
        </a>
        <button id="sidebar-close" class="btn-icon" aria-label="Close navigation">✕</button>
      </div>
      <div class="sidebar-search">
        <input type="text" id="search-input" placeholder="⌕  Search guide…" class="search-input" aria-label="Search guide" autocomplete="off">
        <div id="search-results" class="search-results" role="listbox"></div>
      </div>`;

    let navHTML = '<ul class="nav-list"><li class="nav-section-label">Navigation</li>';
    NAV_PAGES.forEach(p => {
      const href = base + p.href;
      navHTML += `<li><a href="${href}" class="nav-item" data-page="${p.id}">
        <span class="nav-icon">${p.icon}</span>${p.label}</a></li>`;
    });
    navHTML += '</ul>';

    const footerHTML = `
      <div class="sidebar-footer">
        <a href="${base}quick-reference.html" class="btn btn-danger btn-full">🚨 Emergency Card</a>
        <a href="${base}gear.html" class="btn btn-outline btn-full">📦 Gear Checklist</a>
        <a href="${base}ai-setup.html" class="btn btn-ghost btn-full">🤖 Bunker Bot</a>
        <a href="${base}changelog.html" class="btn btn-ghost btn-full" style="opacity:.6;font-size:.75rem">📋 Changelog</a>
        <div class="sidebar-live-indicator">
          <span class="sidebar-live-dot"></span>
          <span class="sidebar-live-label">Guide loaded · offline ready</span>
        </div>
      </div>`;

    sidebar.innerHTML = headerHTML + navHTML + footerHTML;
  }

  /* =================== ACTIVE NAV =================== */
  function setActiveNav() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => {
      const page = item.dataset.page;
      const match =
        (page === 'home' && (filename === 'index.html' || filename === '')) ||
        (page !== 'home' && filename.startsWith(page));
      if (match) item.classList.add('active');
    });
  }

  /* =================== SIDEBAR TOGGLE =================== */
  function setupSidebar() {
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('overlay');
    const menuBtn   = document.getElementById('menu-toggle');
    if (!sidebar || !overlay || !menuBtn) return;

    let _scrollY = 0;

    menuBtn.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('click', e => {
      const closeBtn = document.getElementById('sidebar-close');
      if (closeBtn && closeBtn.contains(e.target)) closeSidebar();
    });

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      /* iOS Safari fix: position:fixed prevents background scroll */
      _scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top      = `-${_scrollY}px`;
      document.body.style.width    = '100%';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, _scrollY);
    }

    /* Close sidebar on nav item click (mobile) */
    document.addEventListener('click', e => {
      if (e.target.classList.contains('nav-item') && window.innerWidth < 900) {
        closeSidebar();
      }
    });
  }

  /* =================== BUNKER BOT PANEL TOGGLE =================== */
  function setupARIAToggle() {
    const toggleBtn = document.getElementById('aria-toggle');
    const closeBtn  = document.getElementById('aria-close');
    const panel     = document.getElementById('aria-panel');
    const main      = document.querySelector('.main-content');
    const overlay   = document.getElementById('overlay');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      if (main) main.classList.toggle('aria-open', isOpen);
      if (window.innerWidth < 900 && overlay) {
        overlay.classList.toggle('active', isOpen);
      }
      if (isOpen && typeof ariaInit === 'function') ariaInit();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
        if (main) main.classList.remove('aria-open');
        if (overlay) overlay.classList.remove('active');
      });
    }
  }

  /* =================== BACK TO TOP =================== */
  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =================== PRINT =================== */
  function setupPrintButtons() {
    document.querySelectorAll('[data-print]').forEach(btn => {
      btn.addEventListener('click', () => window.print());
    });
  }

  /* =================== READING TIME =================== */
  function setupReadingTime() {
    const el = document.getElementById('reading-time');
    if (!el) return;
    const main = document.querySelector('.content-wrapper');
    if (!main) return;
    const words = main.innerText.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 220));
    el.textContent = `~${mins} min read`;
  }

  /* =================== LAST UPDATED =================== */
  function setupLastUpdated() {
    const els = document.querySelectorAll('[data-updated]');
    els.forEach(el => {
      /* Format: data-updated="2025-06" → "June 2025" */
      const raw = el.dataset.updated;
      if (!raw) return;
      try {
        const d = new Date(raw + '-01');
        el.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } catch (_) { el.textContent = raw; }
    });
  }

  /* =================== KEYBOARD SHORTCUTS =================== */
  function setupKeyboard() {
    document.addEventListener('keydown', e => {
      /* / → focus search */
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.getElementById('search-input');
        if (document.activeElement !== searchInput && searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
      /* Escape → close overlay/sidebar/aria */
      if (e.key === 'Escape') {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('aria-panel')?.classList.remove('open');
        document.querySelector('.main-content')?.classList.remove('aria-open');
        document.getElementById('overlay')?.classList.remove('active');
        document.getElementById('search-results')?.classList.remove('active');
        document.body.style.overflow = '';
      }
      /* Ctrl+P → print */
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        /* Let the browser handle it */
      }
    });
  }

  /* =================== COPY CODE BLOCKS =================== */
  function setupCopyCode() {
    document.querySelectorAll('pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-ghost';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;font-size:.7rem;opacity:.6';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.innerText).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }

  /* =================== UTILITY EXPORTS =================== */
  window.appPrint = () => window.print();

  /* =================== SERVICE WORKER =================== */
  function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      const swPath = window.location.pathname.includes('/sections/') ? '../sw.js' : 'sw.js';
      const scope = window.location.pathname.includes('/sections/') ? '../' : '/';
      navigator.serviceWorker.register(swPath, { scope }).catch(() => {});
    }
  }

  /* =================== MODE BAR =================== */
  function setupModeBar() {
    const bar = document.createElement('div');
    bar.className = 'mode-bar no-print';
    bar.innerHTML = `
      <button data-mode="" title="Normal mode">Normal</button>
      <button data-mode="mode-hc" title="High contrast">Hi-C</button>
      <button data-mode="mode-nv" title="Night vision (red)">NV</button>
      <span style="color:var(--border-hi);margin:0 0.25rem">|</span>
      <button data-font="" title="Normal font size">A</button>
      <button data-font="font-lg" title="Large font">A+</button>
      <button data-font="font-xl" title="Extra large font">A++</button>
    `;
    document.body.appendChild(bar);

    const savedMode = localStorage.getItem('display-mode') || '';
    const savedFont = localStorage.getItem('font-size') || '';
    if (savedMode) document.body.classList.add(savedMode);
    if (savedFont) document.body.classList.add(savedFont);

    bar.querySelectorAll('[data-mode]').forEach(btn => {
      if (btn.dataset.mode === savedMode) btn.classList.add('active');
      btn.addEventListener('click', () => {
        bar.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.classList.remove('mode-hc', 'mode-nv');
        if (btn.dataset.mode) document.body.classList.add(btn.dataset.mode);
        localStorage.setItem('display-mode', btn.dataset.mode);
      });
    });
    bar.querySelectorAll('[data-font]').forEach(btn => {
      if (btn.dataset.font === savedFont) btn.classList.add('active');
      btn.addEventListener('click', () => {
        bar.querySelectorAll('[data-font]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.classList.remove('font-lg', 'font-xl');
        if (btn.dataset.font) document.body.classList.add(btn.dataset.font);
        localStorage.setItem('font-size', btn.dataset.font);
      });
    });
  }

  /* =================== INSTALL PROMPT =================== */
  function setupInstallPrompt() {
    /* Don't show if already running as installed PWA */
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) return;

    /* Only on mobile */
    if (window.innerWidth > 900) return;

    /* Track visits; show on 2nd+ visit only */
    const visits = parseInt(localStorage.getItem('ll-visits') || '0') + 1;
    localStorage.setItem('ll-visits', visits);
    if (visits < 2) return;

    /* Respect a 30-day dismiss */
    const dismissed = parseInt(localStorage.getItem('ll-install-dismissed') || '0');
    if (dismissed && Date.now() - dismissed < 30 * 86400000) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let deferred = null;

    function showBanner() {
      if (document.getElementById('install-banner')) return;
      const banner = document.createElement('div');
      banner.id = 'install-banner';
      banner.setAttribute('role', 'complementary');
      banner.setAttribute('aria-label', 'Install app');

      if (isIOS) {
        banner.innerHTML = `
          <span class="ib-icon">⚡</span>
          <div class="ib-text">
            <strong>Install Last Light</strong>
            <small>Tap <strong>Share ↑</strong> then <strong>Add to Home Screen</strong></small>
          </div>
          <button class="ib-dismiss" aria-label="Dismiss">✕</button>`;
      } else {
        banner.innerHTML = `
          <span class="ib-icon">⚡</span>
          <div class="ib-text">
            <strong>Install Last Light</strong>
            <small>Works fully offline — no app store needed</small>
          </div>
          <button class="ib-install btn btn-sm btn-primary">Install</button>
          <button class="ib-dismiss" aria-label="Dismiss">✕</button>`;
      }

      document.body.appendChild(banner);

      banner.querySelector('.ib-dismiss').addEventListener('click', () => {
        banner.remove();
        localStorage.setItem('ll-install-dismissed', Date.now());
      });

      banner.querySelector('.ib-install')?.addEventListener('click', () => {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.then(({ outcome }) => {
          if (outcome === 'accepted') banner.remove();
          deferred = null;
        });
      });

      /* Auto-hide after 12 s if user ignores it */
      setTimeout(() => banner?.remove(), 12000);
    }

    /* Android/Chrome: capture the native install event */
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferred = e;
      showBanner();
    });

    /* iOS: show instructions after a short delay */
    if (isIOS) setTimeout(showBanner, 2000);
  }

})();
