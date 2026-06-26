/* =========================================
   THE LAST LIGHT SURVIVAL GUIDE
   app.js — Navigation, print, utilities
   ========================================= */

(function () {
  'use strict';

  /* =================== ICON SET =================== */
  /* Compact inline SVG icons — stroke-based, currentColor, 24×24 viewbox */
  const ICONS = {
    // Navigation
    home:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 3l9 9"/><path d="M5 10v9h5v-5h4v5h5v-9"/></svg>`,
    water:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C9 7 5 11 5 15a7 7 0 0014 0c0-4-4-8-7-13z"/></svg>`,
    medical:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5z"/></svg>`,
    energy:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>`,
    shelter:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M12 4L2 20M12 4l10 16M9 20l3-6 3 6"/></svg>`,
    comms:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="9" x2="12" y2="18"/><path d="M9 12a4 4 0 006 0"/><path d="M6 9a8 8 0 0012 0"/><path d="M3 6a12 12 0 0018 0"/></svg>`,
    compass:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16.24,7.76 13.12,13.12 7.76,16.24 10.88,10.88"/></svg>`,
    shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 6v6c0 5.5 3.9 10.7 9 12 5.1-1.3 9-6.5 9-12V6z"/></svg>`,
    book:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 012-2h12v14H6a2 2 0 000 4h12v-2"/></svg>`,
    leaf:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V11"/><path d="M12 11C12 6 8 2 3 3c0 5 3 8 9 8z"/><path d="M12 11c0-5 4-8 9-8-1 5-4 8-9 8z"/></svg>`,
    paw:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="6.5" r="2"/><circle cx="18.5" cy="6.5" r="2"/><circle cx="9.5" cy="4.5" r="2"/><circle cx="14.5" cy="4.5" r="2"/><path d="M12 19c-4 0-7-3-7-5 0-1.5 1.5-2.5 3-1l4 3.5 4-3.5c1.5-1.5 3-.5 3 1 0 2-3 5-7 5z"/></svg>`,
    vet:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="1.8"/><circle cx="18" cy="7" r="1.8"/><circle cx="10" cy="4.5" r="1.6"/><circle cx="14" cy="4.5" r="1.6"/><path d="M12 18c-3 0-5.5-2.2-5.5-4 0-1.2 1.2-2 2.5-.9L12 15.5l3-3.4c1.3-1.1 2.5-.3 2.5.9 0 1.8-2.5 4-5.5 4z"/><path d="M12 19.5v3M10.5 21h3"/></svg>`,
    baby:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><path d="M9 9.5c1 .8 2 1.2 3 1.2s2-.4 3-1.2"/><path d="M12 10.7V15M12 15l-3.5 4M12 15l3.5 4M7 12.5l5 1.5 5-1.5"/></svg>`,
    nbc:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5V4M14.2 10.7l4.6-2.7M14.2 13.3l4.6 2.7M12 14.5V20M9.8 13.3l-4.6 2.7M9.8 10.7L5.2 8"/></svg>`,
    tornado:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M5 4h14M7 8h10M9 12h6M11 16h2M12 20v-4"/></svg>`,
    globe:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c-2 3-3 6-3 9s1 6 3 9M12 3c2 3 3 6 3 9s-1 6-3 9"/><path d="M3 12h18"/></svg>`,
    hammer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5L4 16l2 2L17 7z"/><path d="M15 5l3-3 4 4-3 3z"/><path d="M6 18l-3 3"/></svg>`,
    columns:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M2 20h20"/><path d="M4 20V9M8 20V9M12 20V9M16 20V9M20 20V9"/><path d="M2 9h20M2 6l10-4 10 4"/></svg>`,
    brain:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A4 4 0 005 6c0 .9.3 1.8.7 2.5A4 4 0 003 12a4 4 0 003.3 3.9A3.5 3.5 0 0010 19h4a3.5 3.5 0 003.7-3.1A4 4 0 0021 12a4 4 0 00-2.7-3.5c.4-.7.7-1.6.7-2.5a4 4 0 00-4.5-4"/></svg>`,
    flask:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M9 3v7L4 20h16L15 10V3"/><path d="M7 14h10"/></svg>`,
    scissors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    wheel:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>`,
    gear:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M4 20V8l8-6 8 6v12"/><path d="M9 20v-5h6v5"/></svg>`,
    mortar:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16l-2 9H6l-2-9z"/><path d="M12 5v6"/><path d="M9 7h6"/><path d="M2 20h20"/></svg>`,
    tap:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8H3a1 1 0 000 2h1v3a3 3 0 006 0v-3h1V8z"/><path d="M14 10h2a3 3 0 013 3v5"/><path d="M21 18H17"/><path d="M7 3v5"/></svg>`,
    target:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>`,
    wrench:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z"/></svg>`,
    books:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h4V4H4zM10 4v16h4V4h-4z"/><path d="M17 6l3.5 14M17 6l3 1"/></svg>`,
    cloud:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17.5a4 4 0 00-1.3-7.78A6 6 0 005 9.5a4.5 4.5 0 00.5 8h11"/><path d="M12 12v6m0 0l-2.5-2.5M12 18l2.5-2.5"/></svg>`,
    projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l5-5"/><path d="M14.5 5.5l4 4M12.8 7.2l4 4-7.3 7.3a1.5 1.5 0 01-.7.4l-3.3.8.8-3.3a1.5 1.5 0 01.4-.7z"/><path d="M14.5 5.5l1.8-1.8a2 2 0 012.8 0l1.2 1.2a2 2 0 010 2.8L18.5 9.5z"/></svg>`,
    atom:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>`,
    // UI
    print:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M9 18v4h6v-4H9z"/></svg>`,
    robot:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M8 10V8a4 4 0 018 0v2"/><circle cx="9" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/><path d="M9 19h6"/><line x1="12" y1="3" x2="12" y2="5"/></svg>`,
    alert:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    clipboard:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    save:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    file:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    changelog:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
    // Skills categories
    fire:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C9 7 6 10 6 14a6 6 0 0012 0c0-4-3-7-6-12z"/><path d="M10 18a2 2 0 004 0c0-2-2-4-2-4s-2 2-2 4z"/></svg>`,
    knot:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M8 4c0 0-2 4 1 7s5 7 1 11M16 4c0 0 2 4-1 7s-5 7-1 11M8 20c2-1 6-1 8 0M8 4c2 1 6 1 8 0"/></svg>`,
    firstaid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12h6M12 9v6"/></svg>`,
    hunting:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="3"/></svg>`,
    axe:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="21" x2="15" y2="9"/><path d="M12 6L6 12l4 4 6-6-1-1"/><path d="M15 9l3-3 3 3-3 3z"/></svg>`,
    grid4:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    // Misc UI
    bag:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    box:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    wallet:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01M2 10h20"/></svg>`,
    food:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="2" x2="8" y2="12"/><path d="M5 2v10c0 2.2 1.3 4 3 4s3-1.8 3-4V2"/><path d="M16 2a5 5 0 015 5v15"/><path d="M16 9h5"/></svg>`,
    pill:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5L3.5 13.5a5 5 0 017-7l7 7a5 5 0 01-7 7z"/><line x1="8.5" y1="11.5" x2="14" y2="17"/></svg>`,
    solar:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    car:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>`,
    radio:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="12" rx="2"/><path d="M2 15h20M7 12h.01M17 13h2M17 17h2M4 9L12 3l8 6"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  };
  window.ICONS = ICONS;

  /* =================== CONSTANTS =================== */
  const NAV_PAGES = [
    { id: 'home',             href: 'index.html',                      icon: ICONS.home,     label: 'Home' },
    { id: 'food',             href: 'sections/food.html',              icon: ICONS.water,    label: 'Food & Water' },
    { id: 'medical',          href: 'sections/medical.html',           icon: ICONS.medical,  label: 'Medical & First Aid' },
    { id: 'energy',           href: 'sections/energy.html',            icon: ICONS.energy,   label: 'Energy' },
    { id: 'shelter',          href: 'sections/shelter.html',           icon: ICONS.shelter,  label: 'Shelter & Construction' },
    { id: 'communications',   href: 'sections/communications.html',    icon: ICONS.comms,    label: 'Communications' },
    { id: 'navigation',       href: 'sections/navigation.html',        icon: ICONS.compass,  label: 'Navigation & Maps' },
    { id: 'security',         href: 'sections/security.html',          icon: ICONS.shield,   label: 'Security & Defense' },
    { id: 'knowledge',        href: 'sections/knowledge.html',         icon: ICONS.book,     label: 'Knowledge & Literacy' },
    { id: 'science',          href: 'sections/science.html',           icon: ICONS.atom,     label: 'First Principles' },
    { id: 'agriculture',      href: 'sections/agriculture.html',       icon: ICONS.leaf,     label: 'Agriculture' },
    { id: 'animal',           href: 'sections/animal.html',            icon: ICONS.paw,      label: 'Animal Husbandry' },
    { id: 'veterinary',       href: 'sections/veterinary.html',        icon: ICONS.vet,      label: 'Veterinary Care' },
    { id: 'maternal',         href: 'sections/maternal.html',          icon: ICONS.baby,     label: 'Pregnancy & Infant Care' },
    { id: 'nbc',              href: 'sections/nbc.html',               icon: ICONS.nbc,      label: 'NBC / EMP Threats' },
    { id: 'disasters',        href: 'sections/disasters.html',         icon: ICONS.tornado,  label: 'Disaster Playbooks' },
    { id: 'climate',          href: 'sections/climate.html',           icon: ICONS.globe,    label: 'Climate & Regional' },
    { id: 'metallurgy',       href: 'sections/metallurgy.html',        icon: ICONS.hammer,   label: 'Metallurgy' },
    { id: 'governance',       href: 'sections/governance.html',        icon: ICONS.columns,  label: 'Governance' },
    { id: 'psychology',       href: 'sections/psychology.html',        icon: ICONS.brain,    label: 'Psychology & Morale' },
    { id: 'chemistry',        href: 'sections/chemistry.html',         icon: ICONS.flask,    label: 'Chemistry & Materials' },
    { id: 'textiles',         href: 'sections/textiles.html',          icon: ICONS.scissors, label: 'Textiles & Clothing' },
    { id: 'vehicles',         href: 'sections/vehicles.html',          icon: ICONS.wheel,    label: 'Vehicles & Transport' },
    { id: 'build-power',      href: 'sections/build-power.html',       icon: ICONS.gear,     label: 'Power Generation' },
    { id: 'build-structures', href: 'sections/build-structures.html',  icon: ICONS.building, label: 'Building & Structures' },
    { id: 'medicine-making',  href: 'sections/medicine-making.html',   icon: ICONS.mortar,   label: 'Medicine Making' },
    { id: 'build-water',      href: 'sections/build-water.html',       icon: ICONS.tap,      label: 'Water Systems' },
    { id: 'projects',         href: 'sections/projects.html',          icon: ICONS.projects, label: 'Practical Projects' },
    { id: 'skills',           href: 'skills.html',                     icon: ICONS.target,   label: 'Practical Skills' },
    { id: 'tools',            href: 'tools.html',                      icon: ICONS.wrench,   label: 'Calculators & Tools' },
    { id: 'literature',       href: 'literature.html',                 icon: ICONS.books,    label: 'Reference Library' },
    { id: 'expansion',        href: 'expansion.html',                  icon: ICONS.cloud,    label: 'Expansion Library' },
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
          <span class="logo-icon">${ICONS.energy}</span>
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
        <a href="${base}quick-reference.html" class="btn btn-danger btn-full">${ICONS.alert} Emergency Card</a>
        <a href="${base}gear.html" class="btn btn-outline btn-full">${ICONS.clipboard} Gear Checklist</a>
        <a href="${base}ai-setup.html" class="btn btn-ghost btn-full">${ICONS.robot} Bunker Bot</a>
        <a href="${base}changelog.html" class="btn btn-ghost btn-full" style="opacity:.6;font-size:.75rem">${ICONS.changelog} Changelog</a>
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
          <span class="ib-icon">${ICONS.energy}</span>
          <div class="ib-text">
            <strong>Install Last Light</strong>
            <small>Tap <strong>Share ↑</strong> then <strong>Add to Home Screen</strong></small>
          </div>
          <button class="ib-dismiss" aria-label="Dismiss">✕</button>`;
      } else {
        banner.innerHTML = `
          <span class="ib-icon">${ICONS.energy}</span>
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
