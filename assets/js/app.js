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
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
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
    // Added for emoji → icon replacement
    bulb:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1.1 2V17h5v-1.2c.1-.8.5-1.5 1.1-2A6 6 0 0012 3z"/></svg>`,
    check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg>`,
    stop:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>`,
    clock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4"/></svg>`,
    link:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5"/></svg>`,
    user:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>`,
    users:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6.5 6.5 0 013.5 6"/></svg>`,
    lock:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>`,
    heart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.5 3.6 4.3 6.8C19.5 15.4 12 20 12 20z"/></svg>`,
    menu:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    x:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    info:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`,
    search:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`,
    map:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>`,
    tent:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20L12 4l9 16z"/><path d="M12 4v16M9 20l3-5 3 5"/></svg>`,
    display:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/></svg>`,
    back:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
    snow:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7"/><path d="M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5"/></svg>`,
  };
  window.ICONS = ICONS;

  /* Path back to the site root from this page ('' at the root, '../' from
     sections/ and pdfs/). One helper so no page is left with broken links. */
  const SITE_BASE = /\/(sections|pdfs)\//.test(window.location.pathname) ? '../' : '';

  /* =================== CONSTANTS =================== */
  /* Grouped by real category (was: one flat list plus a single stray
     "Tools & Maps" label that only ever applied to one item). Related
     pairs that used to sit 20+ items apart — Shelter/Building &
     Structures, Energy/Power Generation, Food & Water/Water Systems,
     Medical/Medicine Making — are now adjacent within Core Survival. */
  const NAV_PAGES = [
    { id: 'home',             href: 'index.html',                      icon: ICONS.home,     label: 'Home' },

    { id: 'food',             href: 'sections/food.html',              icon: ICONS.water,    label: 'Food & Water', section: 'Core Survival' },
    { id: 'build-water',      href: 'sections/build-water.html',       icon: ICONS.tap,      label: 'Water Systems' },
    { id: 'medical',          href: 'sections/medical.html',           icon: ICONS.medical,  label: 'Medical & First Aid' },
    { id: 'medicine-making',  href: 'sections/medicine-making.html',   icon: ICONS.mortar,   label: 'Medicine Making' },
    { id: 'energy',           href: 'sections/energy.html',            icon: ICONS.energy,   label: 'Energy' },
    { id: 'build-power',      href: 'sections/build-power.html',       icon: ICONS.gear,     label: 'Power Generation' },
    { id: 'shelter',          href: 'sections/shelter.html',           icon: ICONS.shelter,  label: 'Shelter & Construction' },
    { id: 'build-structures', href: 'sections/build-structures.html',  icon: ICONS.building, label: 'Building & Structures' },
    { id: 'communications',   href: 'sections/communications.html',    icon: ICONS.comms,    label: 'Communications' },
    { id: 'navigation',       href: 'sections/navigation.html',        icon: ICONS.compass,  label: 'Navigation & Maps' },
    { id: 'security',         href: 'sections/security.html',          icon: ICONS.shield,   label: 'Security & Defense' },

    { id: 'knowledge',        href: 'sections/knowledge.html',         icon: ICONS.book,     label: 'Knowledge & Literacy', section: 'Knowledge & Skills' },
    { id: 'science',          href: 'sections/science.html',           icon: ICONS.atom,     label: 'First Principles' },

    { id: 'agriculture',      href: 'sections/agriculture.html',       icon: ICONS.leaf,     label: 'Agriculture', section: 'Homesteading & Animals' },
    { id: 'animal',           href: 'sections/animal.html',            icon: ICONS.paw,      label: 'Animal Husbandry' },
    { id: 'veterinary',       href: 'sections/veterinary.html',        icon: ICONS.vet,      label: 'Veterinary Care' },
    { id: 'maternal',         href: 'sections/maternal.html',          icon: ICONS.baby,     label: 'Pregnancy & Infant Care' },

    { id: 'nbc',              href: 'sections/nbc.html',               icon: ICONS.nbc,      label: 'NBC / EMP Threats', section: 'Threats & Disasters' },
    { id: 'disasters',        href: 'sections/disasters.html',         icon: ICONS.tornado,  label: 'Disaster Playbooks' },
    { id: 'climate',          href: 'sections/climate.html',           icon: ICONS.globe,    label: 'Climate & Regional' },

    { id: 'metallurgy',       href: 'sections/metallurgy.html',        icon: ICONS.hammer,   label: 'Metallurgy', section: 'Trades & Materials' },
    { id: 'chemistry',        href: 'sections/chemistry.html',         icon: ICONS.flask,    label: 'Chemistry & Materials' },
    { id: 'textiles',         href: 'sections/textiles.html',          icon: ICONS.scissors, label: 'Textiles & Clothing' },
    { id: 'vehicles',         href: 'sections/vehicles.html',          icon: ICONS.wheel,    label: 'Vehicles & Transport' },
    { id: 'salvage',          href: 'sections/salvage.html',           icon: ICONS.wrench,   label: 'Salvage & Fuel' },
    { id: 'projects',         href: 'sections/projects.html',          icon: ICONS.projects, label: 'Practical Projects' },

    { id: 'governance',       href: 'sections/governance.html',        icon: ICONS.columns,  label: 'Governance', section: 'Community & Mind' },
    { id: 'psychology',       href: 'sections/psychology.html',        icon: ICONS.brain,    label: 'Psychology & Morale' },

    { id: 'maps',             href: 'maps.html',                       icon: ICONS.globe,    label: 'Offline Maps', section: 'Tools & Library' },
    { id: 'skills',           href: 'skills.html',                     icon: ICONS.target,   label: 'Practical Skills' },
    { id: 'tools',            href: 'tools.html',                      icon: ICONS.wrench,   label: 'Calculators & Tools' },
    { id: 'gear',             href: 'gear.html',                       icon: ICONS.clipboard, label: 'Gear Checklist' },
    { id: 'print-essentials', href: 'print-essentials.html',           icon: ICONS.print,    label: 'Print the Essentials' },
    { id: 'literature',       href: 'literature.html',                 icon: ICONS.books,    label: 'Reference Library' },
    { id: 'expansion',        href: 'expansion.html',                  icon: ICONS.cloud,    label: 'Expansion Library' },
    { id: 'download',         href: 'download.html',                   icon: ICONS.download, label: 'Download / Support' },
  ];

  /* =================== INIT =================== */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    addSkipNav();
    injectManifest();
    buildNav();
    setActiveNav();
    setupPagination();
    setupBreadcrumb();
    recordRecent();
    ensureSearch();
    iconifyChrome();
    wrapTables();
    setupSectionArt();
    setupOnThisPage();
    setupReveal();
    setupPalette();
    setupEmergency();
    iconifyEmoji(document.body);
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
    setupOfflineStatus();
    markStandalone();
  }

  /* =================== EMOJI → LINE ICONS ===================
     Emoji render differently on every OS, ignore night-vision / high-contrast
     colours, and read as dated next to the line icons in the sidebar. Swap an
     emoji that *starts* a label (callout icon, heading, button, list item…)
     for the matching line icon, which inherits the text colour. Emoji in the
     middle of a sentence, ★ ratings and ✓ marks are left alone. */
  const EMOJI_ICON = {
    '⚠': 'alert', '🚨': 'alert', '☠': 'alert', '☢': 'nbc', '☣': 'nbc', '💡': 'bulb', '✅': 'check', '✔': 'check',
    '⛔': 'stop', '🚫': 'stop', '❌': 'stop', '⏱': 'clock', '⏰': 'clock', '⌛': 'clock', '📅': 'calendar', '🗓': 'calendar',
    '🔗': 'link', '🔥': 'fire', '💧': 'water', '🚰': 'tap', '📖': 'book', '📕': 'book', '📗': 'book', '📘': 'book', '📚': 'books',
    '🪢': 'knot', '🧭': 'compass', '🩺': 'medical', '🏥': 'medical', '⚕': 'medical', '🩹': 'firstaid', '💉': 'pill', '💊': 'pill',
    '📋': 'clipboard', '📝': 'clipboard', '📻': 'radio', '📡': 'comms', '📶': 'comms', '☁': 'cloud', '🌧': 'cloud', '🌿': 'leaf', '🌱': 'leaf',
    '🌲': 'leaf', '🌾': 'leaf', '🍃': 'leaf', '🦙': 'robot', '🌍': 'globe', '🌎': 'globe', '🌏': 'globe', '🗺': 'map', '👤': 'user', '👥': 'users',
    '🎣': 'hunting', '🏹': 'hunting', '🎯': 'target', '🪓': 'axe', '🏕': 'tent', '⛺': 'tent', '🛡': 'shield', '🏠': 'home', '🏡': 'home',
    '🛠': 'wrench', '🔧': 'wrench', '🔨': 'hammer', '⚒': 'hammer', '⚙': 'gear', '🔒': 'lock', '🔐': 'lock', '❤': 'heart', '🧠': 'brain',
    '👶': 'baby', '🤰': 'baby', '☀': 'solar', '🌞': 'solar', '⚖': 'columns', '🏛': 'columns', '🔌': 'energy', '⚡': 'energy', '🔋': 'energy',
    '💾': 'save', '📥': 'download', '⬇': 'download', '🖨': 'print', '🤖': 'robot', '📄': 'file', '📃': 'file', '📦': 'box', '🎒': 'bag',
    '🍲': 'food', '🥫': 'food', '🍞': 'food', '🚗': 'car', '🚙': 'car', '🧪': 'flask', '⚗': 'flask', '✂': 'scissors', '🧵': 'scissors',
    '🐾': 'paw', '🐄': 'paw', '🐔': 'paw', '🐕': 'paw', '🔍': 'search', '🔎': 'search', 'ℹ': 'info', '🏗': 'building', '🧱': 'building',
    '🗂': 'clipboard', '📊': 'grid4', '💰': 'wallet', '💷': 'wallet', '💵': 'wallet'
  };
  const SKIP_TAGS = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|SVG|TITLE)$/;
  // Leading emoji (+ optional variation selector / keycap) and the space after it.
  const LEAD_EMOJI = /^(\s*)([ℹ☀-➿⬆⬇⌛⏰-⏺]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDEFF])️?\s?/;

  function iconSpan(name, solo) {
    const s = document.createElement('span');
    s.className = 'ui-icon' + (solo ? ' ui-icon-solo' : '');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICONS[name];
    return s;
  }

  function iconifyEmoji(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        for (let p = n.parentNode; p && p !== root; p = p.parentNode) {
          if (SKIP_TAGS.test(p.nodeName.toUpperCase()) || (p.classList && p.classList.contains('no-iconify'))) return NodeFilter.FILTER_REJECT;
        }
        return LEAD_EMOJI.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const hits = [];
    while (walker.nextNode()) hits.push(walker.currentNode);
    hits.forEach(node => {
      // Only when the emoji starts its element's text (a label), not mid-sentence.
      const prev = node.previousSibling;
      if (prev && !(prev.nodeType === 3 && !prev.nodeValue.trim()) && prev.nodeName !== 'BR') return;
      const m = LEAD_EMOJI.exec(node.nodeValue);
      const name = EMOJI_ICON[m[2]];
      if (!name || !ICONS[name]) return;
      const rest = node.nodeValue.slice(m[0].length);
      const solo = !rest.trim() && !node.nextSibling;
      node.parentNode.insertBefore(iconSpan(name, solo), node);
      node.nodeValue = (m[1] ? ' ' : '') + rest;
      if (!node.nodeValue) node.remove();
    });
  }
  window.iconifyEmoji = iconifyEmoji;

  /* Header / panel controls: same icons everywhere, whatever the page markup says. */
  function iconifyChrome() {
    const set = (el, icon, label) => {
      if (!el) return;
      const text = label != null ? label : el.textContent.replace(LEAD_EMOJI, '').trim();
      el.textContent = '';
      el.appendChild(iconSpan(icon, !text));
      if (text) { const l = document.createElement('span'); l.className = 'btn-label'; l.textContent = text; el.appendChild(l); }
    };
    set(document.getElementById('menu-toggle'), 'menu', '');
    set(document.getElementById('sidebar-close'), 'x', '');
    set(document.getElementById('aria-close'), 'x', '');
    document.querySelectorAll('.header-actions [data-print], .header-actions [onclick*="print"]').forEach(b => set(b, 'print', 'Print'));
    const bot = document.getElementById('aria-toggle');
    if (bot) set(bot, 'robot', 'Bunker Bot');
    document.querySelectorAll('.aria-avatar').forEach(a => { if (!a.querySelector('svg')) set(a, 'robot', ''); });
  }

  /* =================== BREADCRUMB =================== */
  /* "Core Survival › Medical & First Aid" instead of always "Last Light
     Guide". Tapping the group opens it in the sidebar. */
  function setupBreadcrumb() {
    const cur = currentNavPage();
    const crumb = document.querySelector('.header-breadcrumb .crumb-parent');
    if (!cur || !cur.group || !crumb) return;
    crumb.textContent = cur.group;
    crumb.setAttribute('href', '#');
    crumb.setAttribute('role', 'button');
    crumb.title = 'Show ' + cur.group + ' in the menu';
    crumb.addEventListener('click', e => {
      e.preventDefault();
      const li = document.querySelector(`.nav-group[data-group="${navGroups().find(g => g.name === cur.group).slug}"]`);
      if (!li) return;
      const btn = li.querySelector('.nav-group-toggle');
      if (btn.getAttribute('aria-expanded') !== 'true') btn.click();
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth < 900 && sidebar && !sidebar.classList.contains('open')) {
        const t = document.getElementById('menu-toggle'); if (t) t.click();
      }
      const list = document.querySelector('.nav-list');
      if (list) list.scrollTop += li.getBoundingClientRect().top - list.getBoundingClientRect().top - 8;
      li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
      btn.focus({ preventScroll: true });
    });
  }

  /* =================== RECENT PAGES =================== */
  function rootPath() {
    const parts = location.pathname.split('/');
    const file = parts.pop() || 'index.html';
    const dir = (location.pathname.match(/\/(sections|pdfs)\/[^/]*$/) || [])[1];
    return (dir ? dir + '/' : '') + file;
  }
  function recordRecent() {
    const cur = currentNavPage();
    const title = cur ? cur.label : (document.querySelector('.page-title, h1') || {}).textContent || document.title.split(' — ')[0];
    if (!title || /^home\.html$/.test(rootPath())) return;
    try {
      const list = JSON.parse(localStorage.getItem('ll-recent') || '[]').filter(r => r.href !== rootPath());
      list.unshift({ href: rootPath(), title: title.trim(), group: cur ? cur.group : '' });
      localStorage.setItem('ll-recent', JSON.stringify(list.slice(0, 8)));
    } catch (e) {}
  }

  /* Heavy scripts load only when needed (lighter, faster pages on old
     phones): search.js (~107 KB) when idle or as soon as you search;
     bunker-bot.js (~48 KB) the first time the Bunker Bot panel opens.
     Both are pre-cached by the service worker, so this works offline. */
  const scriptLoads = {};
  function loadScript(name) {
    if (scriptLoads[name]) return scriptLoads[name];
    const existing = document.querySelector(`script[src$="assets/js/${name}"]`);
    scriptLoads[name] = existing ? Promise.resolve() : new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = SITE_BASE + 'assets/js/' + name;
      sc.onload = () => resolve(); sc.onerror = reject;
      document.body.appendChild(sc);
    });
    return scriptLoads[name];
  }
  window.LastLight = window.LastLight || {};
  window.LastLight.loadScript = loadScript;
  function ensureSearch() {
    const load = () => loadScript('search.js').catch(() => {});
    const input = document.getElementById('search-input');
    if (input) input.addEventListener('focus', () => {
      load().then(() => { if (input.value.trim()) input.dispatchEvent(new Event('input')); });
    }, { once: true });
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 5000 }); else setTimeout(load, 3000);
  }

  /* =================== ON THIS PAGE =================== */
  /* Built from the page's own <h2>s, so every long page gets one. Wide
     screens: a sticky panel beside the text that follows your position.
     Narrower screens: a sticky "On this page" bar that opens a list. */
  function setupOnThisPage() {
    const cur = currentNavPage();
    if (cur && cur.id === 'home') return;
    const wrap = document.querySelector('.content-wrapper');
    if (!wrap) return;
    const heads = [...wrap.querySelectorAll('h2')].filter(h =>
      h.offsetParent !== null && !h.closest('.toc, .callout, .aria-panel, .modal, dialog, [hidden], .shelf-pop'));
    if (heads.length < 3) return;
    const slug = t => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
    const used = new Set();
    const items = heads.map(h => {
      let id = h.id;
      if (!id && h.parentElement.tagName === 'SECTION' && h.parentElement.id && h.parentElement.firstElementChild === h) id = h.parentElement.id;
      if (!id) { id = slug(h.textContent) || 'part'; while (document.getElementById(id) || used.has(id)) id += '-2'; h.id = id; }
      used.add(id);
      return { id, el: h, text: h.textContent.replace(/\s+/g, ' ').trim() };
    });
    const linkList = cls => `<ol class="${cls}">` + items.map(it =>
      `<li><a href="#${it.id}" data-otp="${it.id}">${it.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</a></li>`).join('') + '</ol>';

    // Wide screens: side panel
    const panel = document.createElement('nav');
    panel.className = 'otp-panel no-print';
    panel.setAttribute('aria-label', 'On this page');
    panel.innerHTML = `<div class="otp-title">On this page</div>` + linkList('otp-list');
    document.body.appendChild(panel);
    document.querySelector('.main-content') && document.querySelector('.main-content').classList.add('has-otp');

    // Narrow screens: sticky jump bar after the page intro
    const bar = document.createElement('div');
    bar.className = 'otp-bar no-print';
    bar.innerHTML = `<button type="button" class="otp-toggle" aria-expanded="false" aria-controls="otp-drop">
        <span class="otp-k">On this page</span><span class="otp-cur">${items[0].text}</span><span class="nav-group-chev" aria-hidden="true"></span>
      </button><div class="otp-drop" id="otp-drop" hidden>${linkList('otp-list')}</div>`;
    // Sticky only works within its parent, so place the bar as a direct
    // child of the content column, right after the block holding the intro.
    let anchor = wrap.querySelector('.section-meta') || wrap.querySelector('.section-header, header');
    while (anchor && anchor.parentElement !== wrap) anchor = anchor.parentElement;
    if (anchor) anchor.insertAdjacentElement('afterend', bar);
    else { let h = items[0].el; while (h.parentElement !== wrap) h = h.parentElement; wrap.insertBefore(bar, h); }
    const tog = bar.querySelector('.otp-toggle'), drop = bar.querySelector('.otp-drop');
    const closeDrop = () => { drop.hidden = true; tog.setAttribute('aria-expanded', 'false'); };
    tog.addEventListener('click', e => { e.stopPropagation(); drop.hidden = !drop.hidden; tog.setAttribute('aria-expanded', String(!drop.hidden)); });
    drop.addEventListener('click', e => { if (e.target.closest('a')) closeDrop(); });
    document.addEventListener('click', e => { if (!bar.contains(e.target)) closeDrop(); });

    // Follow the reader's position
    let ticking = false, last = null;
    const spy = () => {
      ticking = false;
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 62) + 90;
      let active = items[0];
      for (const it of items) { if (it.el.getBoundingClientRect().top - line <= 0) active = it; else break; }
      if (active === last) return; last = active;
      document.querySelectorAll('[data-otp]').forEach(a => {
        const on = a.dataset.otp === active.id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      bar.querySelector('.otp-cur').textContent = active.text;
      const a = panel.querySelector('a.active');
      if (a) { const pr = panel.getBoundingClientRect(), ar = a.getBoundingClientRect(); if (ar.top < pr.top || ar.bottom > pr.bottom) panel.scrollTop += ar.top - pr.top - pr.height / 3; }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  /* =================== SEARCH PALETTE =================== */
  /* A header Search button (also Ctrl/Cmd-K or "/") that works on every
     screen size — the sidebar box was hidden on phones. Empty box shows
     your recent pages. */
  function setupPalette() {
    const base = SITE_BASE;
    const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    // Header button
    const anchor = document.querySelector('.header-actions') ||
                   (document.getElementById('aria-toggle') && document.getElementById('aria-toggle').parentNode) ||
                   document.querySelector('.top-bar');
    if (anchor) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-outline search-btn no-print';
      btn.setAttribute('aria-label', 'Search the guide');
      btn.appendChild(iconSpan('search', false));
      const l = document.createElement('span'); l.className = 'btn-label'; l.textContent = 'Search'; btn.appendChild(l);
      const k = document.createElement('kbd'); k.className = 'search-kbd'; k.textContent = mac ? '⌘K' : 'Ctrl K'; btn.appendChild(k);
      btn.addEventListener('click', () => open());
      anchor.insertBefore(btn, anchor.firstChild);
    }

    const pal = document.createElement('div');
    pal.className = 'palette no-print';
    pal.hidden = true;
    pal.innerHTML = `<div class="palette-backdrop"></div>
      <div class="palette-box" role="dialog" aria-modal="true" aria-label="Search the guide">
        <div class="palette-field">${ICONS.search}
          <input type="search" class="palette-input" placeholder="Search — e.g. bleeding, water filter, fire" aria-label="Search the guide"
                 autocomplete="off" role="combobox" aria-expanded="true" aria-controls="palette-results" aria-autocomplete="list">
          <button type="button" class="palette-close" aria-label="Close">Esc</button>
        </div>
        <div class="palette-results" id="palette-results" role="listbox"></div>
        <div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
      </div>`;
    document.body.appendChild(pal);
    const input = pal.querySelector('.palette-input'), out = pal.querySelector('.palette-results');
    let idx = 0, lastFocus = null;

    const EXTRA = [
      { href: 'quick-reference.html', label: 'Emergency Card', group: 'Quick access' },
      { href: 'ai-setup.html', label: 'Bunker Bot setup', group: 'Help' },
      { href: 'about.html', label: 'About', group: 'Help' },
      { href: 'changelog.html', label: 'Changelog', group: 'Help' },
    ];
    const pages = () => navPagesWithGroups().map(p => ({ href: p.href, label: p.label, group: p.group || '' })).concat(EXTRA);
    const row = (href, title, sub, icon) =>
      `<a class="palette-item" role="option" href="${base}${href}">${icon ? `<span class="palette-ico">${icon}</span>` : ''}
         <span class="palette-text"><span class="palette-t">${title}</span>${sub ? `<span class="palette-s">${esc(sub)}</span>` : ''}</span></a>`;
    const hl = (t, q) => { let h = esc(t); q.split(/\s+/).filter(w => w.length > 1).forEach(w => { h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return h; };

    function render() {
      const q = input.value.trim();
      let html = '';
      if (!q) {
        let recent = [];
        try { recent = JSON.parse(localStorage.getItem('ll-recent') || '[]').filter(r => r.href !== rootPath()); } catch (e) {}
        if (recent.length) {
          html += '<div class="palette-group">Recent</div>' + recent.slice(0, 6).map(r => row(r.href, esc(r.title), r.group, ICONS.clock)).join('');
        }
        html += '<div class="palette-group">Quick access</div>' +
          `<a class="palette-item palette-sos" role="option" href="#sos" data-sos=""><span class="palette-ico">${ICONS.alert}</span><span class="palette-text"><span class="palette-t">Emergency steps</span><span class="palette-s">Bleeding, not breathing, choking, burns…</span></span></a>` +
          [['quick-reference.html', 'Emergency Card', 'Printable one-page reference', ICONS.clipboard],
           ['sections/medical.html', 'Medical & First Aid', 'Core Survival', ICONS.medical],
           ['sections/food.html', 'Food & Water', 'Core Survival', ICONS.water]]
          .map(x => row(x[0], esc(x[1]), x[2], x[3])).join('');
      } else {
        const ql = q.toLowerCase();
        const sosHits = (window.guideSearch && window.guideSearch.emergency) ? window.guideSearch.emergency(q) : [];
        if (sosHits.length) html += '<div class="palette-group palette-group-sos">Emergency steps</div>' + sosHits.slice(0, 3).map(c =>
          `<a class="palette-item palette-sos" role="option" href="#sos-${c.id}" data-sos="${c.id}"><span class="palette-ico">${ICONS.alert}</span><span class="palette-text"><span class="palette-t">${esc(c.title)}</span><span class="palette-s">Big step-by-step instructions</span></span></a>`).join('');
        const pm = pages().filter(p => p.label.toLowerCase().includes(ql) || (p.group && p.group.toLowerCase().includes(ql))).slice(0, 5);
        if (pm.length) html += '<div class="palette-group">Pages</div>' + pm.map(p => row(p.href, hl(p.label, q), p.group, ICONS.file)).join('');
        const res = (q.length >= 2 && window.guideSearch) ? window.guideSearch(q) : [];
        const seen = new Set(pm.map(p => p.href));
        const topics = res.filter(r => !(seen.has(r.file) && !r.anchor)).slice(0, 10);
        if (topics.length) html += '<div class="palette-group">Topics</div>' + topics.map(r => row(r.file + (r.anchor || ''), hl(r.title, q), r.sectionLabel, ICONS.book)).join('');
        if (!html) html = `<div class="palette-empty">No matches for “${esc(q)}”. Try a simpler word — e.g. “burn”, “water”, “radio”.</div>`;
      }
      out.innerHTML = html;
      idx = 0; mark();
    }
    function items() { return [...out.querySelectorAll('.palette-item')]; }
    function mark() {
      items().forEach((a, i) => { a.classList.toggle('focused', i === idx); a.setAttribute('aria-selected', String(i === idx)); a.id = 'pal-opt-' + i; });
      const cur = items()[idx];
      if (cur) { input.setAttribute('aria-activedescendant', cur.id); cur.scrollIntoView({ block: 'nearest' }); }
    }
    function open() {
      lastFocus = document.activeElement;
      pal.hidden = false;
      document.documentElement.classList.add('palette-open');
      const sb = document.getElementById('sidebar');
      if (sb && sb.classList.contains('open')) { const ov = document.getElementById('overlay'); if (ov) ov.click(); }
      input.value = '';
      render();
      if (!window.guideSearch) loadScript('search.js').then(() => { if (!pal.hidden) render(); }).catch(() => {});
      input.focus();                       // focus now so fast typing isn't lost
      setTimeout(() => { if (document.activeElement !== input) input.focus(); }, 0);
    }
    function close() {
      pal.hidden = true;
      document.documentElement.classList.remove('palette-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 90); });
    pal.addEventListener('keydown', e => {
      const n = items().length;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowDown' && n) { e.preventDefault(); idx = (idx + 1) % n; mark(); }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); idx = (idx - 1 + n) % n; mark(); }
      else if (e.key === 'Enter' && n && document.activeElement === input) { e.preventDefault(); items()[idx].click(); }
      else if (e.key === 'Tab') { // keep focus inside the dialog
        const f = [input, ...items(), pal.querySelector('.palette-close')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); input.focus(); }
      }
    });
    out.addEventListener('mousemove', e => { const a = e.target.closest('.palette-item'); if (a) { const i = items().indexOf(a); if (i !== idx) { idx = i; mark(); } } });
    out.addEventListener('click', e => {
      const it = e.target.closest('.palette-item'); if (!it) return;
      if (it.hasAttribute('data-sos')) { e.preventDefault(); close(); window.LastLight.sos(it.dataset.sos || undefined); return; }
      close();
    });
    pal.querySelector('.palette-backdrop').addEventListener('click', close);
    pal.querySelector('.palette-close').addEventListener('click', close);
    window.LastLight = window.LastLight || {};
    window.LastLight.openSearch = open;
  }

  /* =================== EMERGENCY MODE =================== */
  /* Red button in every header (and the sidebar's Emergency tile) opens a
     full-screen "what's happening?" picker with big numbered steps.
     emergency.js is loaded on first use (and pre-cached for offline). */
  function loadEmergency() {
    if (window.LastLight && window.LastLight._emergencyReady) return window.LastLight._emergencyReady;
    // Diagrams first (cards render them), then the cards.
    const p = loadScript('emergency-figs.js').catch(() => {}).then(() => loadScript('emergency.js'));
    window.LastLight._emergencyReady = p;
    return p;
  }
  function setupEmergency() {
    window.LastLight = window.LastLight || {};
    const openSOS = id => loadEmergency().then(() => window.LastLight.openEmergency(id));
    window.LastLight.sos = openSOS;

    const anchor = document.querySelector('.header-actions') ||
                   (document.getElementById('aria-toggle') && document.getElementById('aria-toggle').parentNode) ||
                   document.querySelector('.top-bar');
    if (anchor) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm sos-btn no-print';
      btn.setAttribute('aria-label', 'Emergency — step-by-step first aid');
      btn.appendChild(iconSpan('alert', false));
      btn.insertAdjacentHTML('beforeend', '<span class="sos-l-long">Emergency</span><span class="sos-l-short">SOS</span>');
      btn.addEventListener('click', () => openSOS());
      anchor.insertBefore(btn, anchor.firstChild);
    }
    const tile = document.querySelector('.quick-emergency');
    if (tile) tile.addEventListener('click', e => { e.preventDefault(); openSOS(); });
    if (/^#sos/.test(location.hash)) loadEmergency();
    // Warm the cache so it's there offline even if never opened online.
    if ('requestIdleCallback' in window) requestIdleCallback(() => loadEmergency().catch(() => {}), { timeout: 4000 });
    else setTimeout(() => loadEmergency().catch(() => {}), 2500);
  }

  /* =================== SECTION BANNER ART =================== */
  /* A small animated scene on every section header, generated from the
     page's own menu icon and its group's colour: drifting contour lines
     (a map), a glowing badge, rising embers. Pure SVG + CSS, no images. */
  const GROUP_TONE = {
    'Core Survival': 'amber', 'Knowledge & Skills': 'blue', 'Homesteading & Animals': 'green',
    'Threats & Disasters': 'red', 'Trades & Materials': 'orange', 'Community & Mind': 'violet', 'Tools & Library': 'teal'
  };
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function contour(cx, cy, r, rnd, wob) {
    const n = 48, a = [rnd() * 6, rnd() * 6, rnd() * 6], pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2;
      const k = 1 + wob * (0.5 * Math.sin(3 * t + a[0]) + 0.3 * Math.sin(5 * t + a[1]) + 0.2 * Math.sin(2 * t + a[2]));
      pts.push([cx + Math.cos(t) * r * 1.35 * k, cy + Math.sin(t) * r * k]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {           // smooth closed curve through the points
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  }
  function setupSectionArt() {
    const cur = currentNavPage();
    if (!cur || cur.id === 'home') return;
    const header = document.querySelector('.content-wrapper .section-header, .content-wrapper .section-hero');
    if (!header || header.querySelector('.sec-art')) return;
    const rnd = seeded(cur.id);
    const cx = 210, cy = 82;
    let rings = '';
    for (let i = 0; i < 7; i++) {
      const r = 22 + i * 15 + rnd() * 4;
      rings += `<path class="sa-ring" style="--d:${(18 + i * 7 + rnd() * 10).toFixed(1)}s;--o:${(0.5 - i * 0.055).toFixed(2)}" d="${contour(cx, cy, r, rnd, 0.08 + i * 0.012)}"/>`;
    }
    let embers = '';
    for (let i = 0; i < 9; i++) {
      embers += `<circle class="sa-ember" cx="${(cx - 90 + rnd() * 180).toFixed(0)}" cy="${(150 + rnd() * 10).toFixed(0)}" r="${(1 + rnd() * 1.6).toFixed(1)}" style="--t:${(5 + rnd() * 6).toFixed(1)}s;--dl:${(-rnd() * 10).toFixed(1)}s;--dx:${(rnd() * 30 - 15).toFixed(0)}px"/>`;
    }
    const icon = (cur.icon || ICONS.book).replace('<svg ', `<svg x="${cx - 21}" y="${cy - 21}" width="42" height="42" class="sa-icon" `);
    const art = document.createElement('div');
    art.className = 'sec-art';
    art.setAttribute('aria-hidden', 'true');
    art.dataset.tone = GROUP_TONE[cur.group] || 'amber';
    art.innerHTML = `<svg viewBox="0 0 320 164" preserveAspectRatio="xMidYMid meet">
      <defs><radialGradient id="sa-glow"><stop offset="0" stop-color="currentColor" stop-opacity=".55"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>
      <g class="sa-rings">${rings}</g>
      <circle class="sa-halo" cx="${cx}" cy="${cy}" r="58" fill="url(#sa-glow)"/>
      <circle class="sa-badge" cx="${cx}" cy="${cy}" r="33"/>
      <circle class="sa-badge-ring" cx="${cx}" cy="${cy}" r="39"/>
      ${icon}
      <g class="sa-embers">${embers}</g>
    </svg>`;
    header.classList.add('has-sec-art');
    header.insertBefore(art, header.firstChild);
  }

  /* =================== SCROLL REVEAL =================== */
  /* Content eases up as it scrolls into view. Off for "reduce motion",
     printing, and anything already on screen when the page loads. */
  function setupReveal() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = document.querySelector('.content-wrapper');
    if (!wrap) return;
    const targets = wrap.querySelectorAll('.callout, .card, .steps > li, .table-wrap, .table-scroll, .toc, .pdf-card, .zim-card, .install-card, .diagram, figure, .shelf, section > h2, .section-card');
    const vh = window.innerHeight;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    let n = 0;
    targets.forEach(el => {
      if (el.closest('.otp-bar, .sos, .palette')) return;
      if (el.getBoundingClientRect().top < vh) return;          // already visible: leave alone
      el.classList.add('rv');
      if (el.matches('.steps > li')) el.style.setProperty('--rv-d', Math.min([...el.parentNode.children].indexOf(el), 5) * 60 + 'ms');
      io.observe(el); n++;
    });
    if (n) document.documentElement.classList.add('rv-on');
    // Safety: never leave anything hidden (e.g. jumping to an anchor, find-in-page).
    window.addEventListener('beforeprint', () => document.querySelectorAll('.rv').forEach(el => el.classList.add('rv-in')));
  }

  /* =================== WIDE TABLES =================== */
  /* Give every table its own horizontal scroller so a wide table scrolls
     inside itself on a phone instead of making the whole page wider. */
  function wrapTables() {
    document.querySelectorAll('main table, .main-content table, .content-wrapper table').forEach(t => {
      const p = t.parentElement;
      if (!p || p.classList.contains('table-wrap') || p.classList.contains('table-scroll')) return;
      const w = document.createElement('div');
      w.className = 'table-scroll';
      w.tabIndex = 0;                         // keyboard users can scroll it too
      w.setAttribute('role', 'region');
      const cap = t.querySelector('caption, th');
      w.setAttribute('aria-label', cap ? 'Table: ' + cap.textContent.trim().slice(0, 60) : 'Table');
      p.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  /* =================== PWA MANIFEST + IOS META =================== */
  function injectManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;
    const base = SITE_BASE;

    const link = document.createElement('link');
    link.rel  = 'manifest';
    link.href = `${base}manifest.json`;
    document.head.appendChild(link);

    const touch = document.createElement('link');
    touch.rel  = 'apple-touch-icon';
    touch.href = `${base}assets/icons/apple-touch-icon.png`;
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

  /* =================== NAV MODEL ===================
     NAV_PAGES is the single source of truth for order and grouping: the
     sidebar, Prev/Next links and "Section X of Y" are all derived from it. */
  function navGroups() {
    const groups = [{ name: '', slug: 'top', pages: [] }];
    NAV_PAGES.forEach(p => {
      if (p.section) groups.push({ name: p.section, slug: p.section.toLowerCase().replace(/[^a-z]+/g, '-'), pages: [] });
      groups[groups.length - 1].pages.push(p);
    });
    return groups.filter(g => g.pages.length);
  }
  function navPagesWithGroups() {
    const out = [];
    navGroups().forEach(g => g.pages.forEach(p => out.push(Object.assign({ group: g.name }, p))));
    return out;
  }
  function currentNavPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    const inSections = path.includes('/sections/');
    return navPagesWithGroups().find(p => {
      const parts = p.href.split('/');
      return parts.pop() === file && (parts[0] === 'sections') === inSections;
    }) || null;
  }
  function readNavState() {
    try { return JSON.parse(localStorage.getItem('nav-groups') || '{}') || {}; } catch (e) { return {}; }
  }

  /* =================== PREV / NEXT + SECTION COUNTER =================== */
  function setupPagination() {
    const cur = currentNavPage();
    if (!cur || cur.id === 'home') return;
    const base = SITE_BASE;
    const pages = navPagesWithGroups();
    const i = pages.findIndex(p => p.id === cur.id);
    const prev = pages[i - 1], next = pages[i + 1];

    // "Section X of Y · Group" — counted over the section pages only.
    const sectionPages = pages.filter(p => p.href.startsWith('sections/'));
    const si = sectionPages.findIndex(p => p.id === cur.id);
    if (si >= 0) {
      const label = `Section ${si + 1} of ${sectionPages.length} · ${cur.group}`;
      const existing = [...document.querySelectorAll('.meta-item')].find(m => /Section\s+\d+\s+of\s+\d+|Supplemental Section/.test(m.textContent));
      if (existing) existing.textContent = '📖 ' + label;
      else {
        const m = document.createElement('span'); m.className = 'meta-item'; m.textContent = '📖 ' + label;
        let meta = document.querySelector('.section-meta');
        if (!meta) {
          // Older page headers have no meta row: add one under the intro.
          const h1 = document.querySelector('main h1, .content-wrapper h1');
          const intro = h1 && h1.parentElement.querySelector('.section-subtitle, .section-desc');
          const after = intro || h1;
          if (after) { meta = document.createElement('div'); meta.className = 'section-meta'; after.insertAdjacentElement('afterend', meta); }
        }
        if (meta) meta.appendChild(m);
      }
    }

    // Replace the hand-written prev/next blocks with ones built from the nav order.
    const old = [...document.querySelectorAll('.section-pagination, .nav-buttons')]
      .filter(n => n.querySelector('a'));
    const host = document.querySelector('.content-wrapper') || document.querySelector('main');
    if (!host && !old.length) return;
    const link = (p, dir) => !p ? '<span class="pagination-spacer"></span>' :
      `<a href="${base + p.href}" class="pagination-btn pagination-${dir}" rel="${dir}">
        <small>${dir === 'prev' ? 'Previous' : 'Next'}${p.group && p.group !== cur.group ? ' · ' + p.group : ''}</small>
        <span>${dir === 'prev' ? '← ' : ''}${p.label}${dir === 'next' ? ' →' : ''}</span></a>`;
    const nav = document.createElement('nav');
    nav.className = 'section-pagination no-print';
    nav.setAttribute('aria-label', 'Previous and next page');
    nav.innerHTML = link(prev || { href: 'index.html', label: 'Home', group: '' }, 'prev') + link(next, 'next');
    if (old.length) { old[0].replaceWith(nav); old.slice(1).forEach(n => n.remove()); }
    else host.appendChild(nav);
  }

  /* =================== NAV BUILD =================== */
  function buildNav() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const base = SITE_BASE;

    // On the public site only, a small link back to the marketing landing page.
    // (The landing isn't bundled in the offline download, so we hide it there
    //  to avoid a dead link.)
    const onLive = /(^|\.)bunkerbot\.co\.uk$/.test(location.hostname);
    const homeLinkHTML = onLive
      ? `<a href="/" class="sidebar-toplink" title="Back to the front page"
           style="display:flex;align-items:center;gap:.4rem;padding:.45rem .9rem;font-size:.76rem;color:var(--text-3);text-decoration:none;border-bottom:1px solid var(--border);transition:color .15s"
           onmouseover="this.style.color='var(--amber)'" onmouseout="this.style.color='var(--text-3)'">← Home</a>`
      : '';

    const headerHTML = `
      ${homeLinkHTML}
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
      </div>
      <nav class="sidebar-quick" aria-label="Quick access">
        <a href="${base}quick-reference.html" class="quick-tile quick-emergency" data-page="quick-reference">${ICONS.alert}<span>Emergency</span></a>
        <a href="${base}sections/medical.html" class="quick-tile" data-page="medical">${ICONS.medical}<span>Medical</span></a>
        <a href="${base}sections/food.html" class="quick-tile" data-page="food">${ICONS.water}<span>Food &amp; Water</span></a>
        <a href="${base}ai-setup.html" class="quick-tile quick-bot" data-page="ai-setup">${ICONS.robot}<span>Bunker Bot</span></a>
      </nav>`;

    /* Groups collapse so the whole structure fits on a phone screen (35+
       links in one open list meant most of the guide was out of sight).
       The group holding the current page always starts open; others
       remember whether the reader left them open. */
    const openState = readNavState();
    const current = currentNavPage();
    let navHTML = '<ul class="nav-list">';
    navGroups().forEach(g => {
      const itemHTML = g.pages.map(p => `<li><a href="${base + p.href}" class="nav-item" data-page="${p.id}">
        <span class="nav-icon">${p.icon}</span><span class="nav-label">${p.label}</span></a></li>`).join('');
      if (!g.name) { navHTML += itemHTML; return; }
      const open = (current && current.group === g.name) || openState[g.slug] === true;
      navHTML += `<li class="nav-group${open ? ' open' : ''}" data-group="${g.slug}">
        <button type="button" class="nav-group-toggle" aria-expanded="${open}" aria-controls="navg-${g.slug}">
          <span class="nav-group-name">${g.name}</span>
          <span class="nav-group-count">${g.pages.length}</span>
          <span class="nav-group-chev" aria-hidden="true"></span>
        </button>
        <ul class="nav-sub" id="navg-${g.slug}"${open ? '' : ' hidden'}>${itemHTML}</ul>
      </li>`;
    });
    navHTML += '</ul>';

    /* Footer: the two "grab it now" actions, then small secondary links.
       (Offline Maps and Download used to be repeated here as well as in the
       Tools & Library list above.) */
    /* Footer: one compact block. The Emergency Card lives in the quick row
       above and the Gear Checklist in Tools & Library, so the list gets the
       height back on phones. */
    const footerHTML = `
      <div class="sidebar-footer">
        <div class="sidebar-minor">
          <a href="${base}ai-setup.html">${ICONS.robot} Bunker Bot setup</a>
          <a href="${base}about.html">${ICONS.info} About</a>
          <a href="${base}changelog.html">${ICONS.changelog} Changelog</a>
        </div>
        <div class="sidebar-live-indicator">
          <span class="sidebar-live-dot"></span>
          <span class="sidebar-live-label" data-offline-status>Checking offline storage…</span>
        </div>
      </div>`;

    sidebar.innerHTML = headerHTML + navHTML + footerHTML;

    sidebar.querySelectorAll('.nav-group-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const li = btn.parentElement, sub = li.querySelector('.nav-sub');
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        li.classList.toggle('open', open);
        sub.hidden = !open;
        const st = readNavState(); st[li.dataset.group] = open;
        try { localStorage.setItem('nav-groups', JSON.stringify(st)); } catch (e) {}
      });
    });
    // "Bunker Bot" quick tile opens the panel when this page has one.
    const botTile = sidebar.querySelector('.quick-bot');
    const botToggle = document.getElementById('aria-toggle');
    if (botTile && botToggle) {
      botTile.addEventListener('click', e => {
        e.preventDefault();
        if (window.innerWidth < 900) { const ov = document.getElementById('overlay'); if (ov) ov.click(); }
        botToggle.click();
      });
    }
  }

  /* =================== ACTIVE NAV =================== */
  function setActiveNav() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const items = document.querySelectorAll('.nav-item');
    let activeItem = null;
    items.forEach(item => {
      const page = item.dataset.page;
      /* Exact match against the link's own href, not a prefix match against
         the page id — startsWith() would false-positive if a future page id
         happened to be a prefix of another page's filename. */
      const itemFilename = (item.getAttribute('href') || '').split('/').pop();
      const match =
        (page === 'home' && (filename === 'index.html' || filename === '')) ||
        (page !== 'home' && filename === itemFilename);
      if (match) { item.classList.add('active'); item.setAttribute('aria-current', 'page'); activeItem = item; }
    });
    const cur = currentNavPage();
    const curId = cur ? cur.id : filename.replace(/\.html$/, '');
    document.querySelectorAll('.quick-tile').forEach(t => {
      if (t.dataset.page === curId) { t.classList.add('active'); t.setAttribute('aria-current', 'page'); }
    });
    /* Bring the current item into view inside the sidebar list only
       (scrollIntoView could also scroll the page itself). */
    const list = document.querySelector('.nav-list');
    if (activeItem && list) {
      const r = activeItem.getBoundingClientRect(), lr = list.getBoundingClientRect();
      list.scrollTop += (r.top - lr.top) - (lr.height / 2 - r.height / 2);
    }
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
      if (isOpen) {
        if (typeof window.ariaInit === 'function') window.ariaInit();
        else loadScript('bunker-bot.js').then(() => window.ariaInit && window.ariaInit()).catch(() => {});
      }
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
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '') || (document.activeElement && document.activeElement.isContentEditable);
      if ((e.key === '/' && !e.ctrlKey && !e.metaKey && !typing) || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
        if (window.LastLight && window.LastLight.openSearch) { e.preventDefault(); window.LastLight.openSearch(); }
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
    /* Only meaningful over http(s); the SW + its precache list live at the site
       root, so register with a root-absolute path that works from any page
       depth (/, /sections/, /pdfs/). Silently skipped on file://. */
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }
  }

  /* =================== DISPLAY MODES =================== */
  /* Colour mode (normal / high-contrast / night-vision red) and text size.
     Lives behind a "Display" button in the page header instead of a bar that
     floated over the content; pages without a header keep the floating bar. */
  function setupModeBar() {
    const savedMode = localStorage.getItem('display-mode') || '';
    const savedFont = localStorage.getItem('font-size') || '';
    if (savedMode) document.body.classList.add(savedMode);
    if (savedFont) document.body.classList.add(savedFont);

    const controls = `
      <div class="display-group" role="group" aria-label="Colour mode">
        <span class="display-label">Colours</span>
        <div class="seg">
          <button type="button" data-mode="" title="Normal colours">Normal</button>
          <button type="button" data-mode="mode-hc" title="High contrast">High contrast</button>
          <button type="button" data-mode="mode-nv" title="Night vision (red) — keeps your eyes dark-adapted">Night</button>
        </div>
      </div>
      <div class="display-group" role="group" aria-label="Text size">
        <span class="display-label">Text size</span>
        <div class="seg">
          <button type="button" data-font="" title="Normal text" aria-label="Normal text">A</button>
          <button type="button" data-font="font-lg" title="Large text" aria-label="Large text" style="font-size:1.1em">A</button>
          <button type="button" data-font="font-xl" title="Extra large text" aria-label="Extra large text" style="font-size:1.25em">A</button>
        </div>
      </div>`;

    const anchor = document.querySelector('.header-actions') ||
                   (document.getElementById('aria-toggle') && document.getElementById('aria-toggle').parentNode) ||
                   document.querySelector('.top-bar');
    let root;
    if (anchor) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-outline display-btn no-print';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.title = 'Display: colours & text size';
      btn.appendChild(iconSpan('display', false));
      const lab = document.createElement('span'); lab.className = 'btn-label'; lab.textContent = 'Display';
      btn.appendChild(lab);
      const bot = document.getElementById('aria-toggle');
      if (bot && bot.parentNode === anchor) anchor.insertBefore(btn, bot); else anchor.appendChild(btn);

      root = document.createElement('div');
      root.className = 'display-panel no-print';
      root.hidden = true;
      root.innerHTML = controls;
      document.body.appendChild(root);

      const place = () => {
        const r = btn.getBoundingClientRect();
        root.style.top = Math.round(r.bottom + 8) + 'px';
        root.style.right = Math.max(8, Math.round(document.documentElement.clientWidth - r.right)) + 'px';
      };
      const close = () => { root.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (root.hidden) { place(); root.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
        else close();
      });
      document.addEventListener('click', e => { if (!root.hidden && !root.contains(e.target)) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !root.hidden) { close(); btn.focus(); } });
      window.addEventListener('resize', () => { if (!root.hidden) place(); });
    } else {
      root = document.createElement('div');
      root.className = 'mode-bar no-print';
      root.innerHTML = controls;
      document.body.appendChild(root);
    }

    const pick = (attr, cls, key, val) => {
      root.querySelectorAll(`[${attr}]`).forEach(b => {
        const on = b.getAttribute(attr) === val;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      document.body.classList.remove(...cls);
      if (val) document.body.classList.add(val);
      try { localStorage.setItem(key, val); } catch (e) {}
    };
    root.querySelectorAll('[data-mode]').forEach(b => {
      const on = b.dataset.mode === savedMode;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', () => pick('data-mode', ['mode-hc', 'mode-nv'], 'display-mode', b.dataset.mode));
    });
    root.querySelectorAll('[data-font]').forEach(b => {
      const on = b.dataset.font === savedFont;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', () => pick('data-font', ['font-lg', 'font-xl'], 'font-size', b.dataset.font));
    });
  }

  /* =================== DEVICE / BROWSER =================== */
  function detectPlatform() {
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const android = /Android/.test(ua);
    // In-app browsers (Instagram, Facebook, Gmail/Google app, TikTok…) can't install web apps.
    const inApp = /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Snapchat|TikTok|musical_ly|Line\/|GSA\/|Twitter|Pinterest/i.test(ua);
    let browser = 'other';
    if (ios) browser = /CriOS/.test(ua) ? 'chrome' : /FxiOS/.test(ua) ? 'firefox' : /EdgiOS/.test(ua) ? 'edge' : 'safari';
    else if (/SamsungBrowser/.test(ua)) browser = 'samsung';
    else if (/Firefox\//.test(ua)) browser = 'firefox';
    else if (/Edg\/|EdgA\//.test(ua)) browser = 'edge';
    else if (/OPR\//.test(ua)) browser = 'opera';
    else if (/Chrome\//.test(ua)) browser = 'chrome';
    else if (/Safari\//.test(ua)) browser = 'safari';
    const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    const os = ios ? 'ios' : android ? 'android' : 'desktop';
    return { os, browser, inApp, standalone, ipad: ios && !/iPhone|iPod/.test(ua) };
  }

  /* Shared install state: the download page's "Install" button and the
     banner both use the browser's native prompt when it is offered. */
  const installState = { deferred: null, installed: false };
  window.LastLight = window.LastLight || {};
  window.LastLight.platform = detectPlatform;
  window.LastLight.canPrompt = () => !!installState.deferred;
  window.LastLight.promptInstall = () => {
    if (!installState.deferred) return Promise.resolve('unavailable');
    const d = installState.deferred;
    installState.deferred = null;
    d.prompt();
    return d.userChoice.then(c => {
      document.dispatchEvent(new CustomEvent('ll-installable', { detail: false }));
      return c.outcome;
    });
  };
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installState.deferred = e;
    document.dispatchEvent(new CustomEvent('ll-installable', { detail: true }));
  });
  window.addEventListener('appinstalled', () => {
    installState.installed = true;
    installState.deferred = null;
    document.dispatchEvent(new CustomEvent('ll-installable', { detail: false }));
    const b = document.getElementById('install-banner'); if (b) b.remove();
  });

  /* =================== INSTALL BANNER =================== */
  function setupInstallPrompt() {
    const pf = detectPlatform();
    if (pf.standalone || pf.os === 'desktop') return;
    if (/download\.html$/.test(location.pathname)) return;   // that page has the full guide

    let visits = 1, dismissed = 0;
    try {
      visits = parseInt(localStorage.getItem('ll-visits') || '0') + 1;
      localStorage.setItem('ll-visits', visits);
      dismissed = parseInt(localStorage.getItem('ll-install-dismissed') || '0');
    } catch (e) {}
    if (visits < 2) return;
    if (dismissed && Date.now() - dismissed < 30 * 86400000) return;

    const base = SITE_BASE;
    const howTo = `${base}download.html#install-phone`;

    function showBanner(kind) {
      if (document.getElementById('install-banner')) return;
      const banner = document.createElement('div');
      banner.id = 'install-banner';
      banner.className = 'no-print';
      banner.setAttribute('role', 'complementary');
      banner.setAttribute('aria-label', 'Install app');
      const msg = {
        prompt: 'One tap — opens like an app and works with no signal.',
        ios: 'Tap <strong>Share</strong> <span class="ib-share" aria-hidden="true"></span> then <strong>Add to Home Screen</strong>.',
        inapp: 'Open this page in Safari or Chrome first — apps like Instagram or Gmail can’t install it.'
      }[kind];
      banner.innerHTML = `
        <span class="ib-icon"><img src="${base}assets/icons/icon-192.png" alt="" width="40" height="40"></span>
        <div class="ib-text">
          <strong>Keep Last Light on your phone</strong>
          <small>${msg}</small>
        </div>
        ${kind === 'prompt' ? '<button class="ib-install btn btn-sm btn-primary">Install</button>'
                            : `<a class="btn btn-sm btn-outline" href="${howTo}">How</a>`}
        <button class="ib-dismiss" aria-label="Dismiss">✕</button>`;
      document.body.appendChild(banner);
      banner.querySelector('.ib-dismiss').addEventListener('click', () => {
        banner.remove();
        try { localStorage.setItem('ll-install-dismissed', Date.now()); } catch (e) {}
      });
      const btn = banner.querySelector('.ib-install');
      if (btn) btn.addEventListener('click', () => window.LastLight.promptInstall().then(o => { if (o === 'accepted') banner.remove(); }));
    }

    if (pf.inApp) { setTimeout(() => showBanner('inapp'), 1500); return; }
    if (pf.os === 'ios') { setTimeout(() => showBanner('ios'), 2000); return; }
    if (installState.deferred) showBanner('prompt');
    document.addEventListener('ll-installable', e => { if (e.detail) showBanner('prompt'); });
  }

  /* =================== OFFLINE STATUS =================== */
  /* The sidebar used to say "offline ready" unconditionally. Now it asks the
     service worker whether every file is actually saved on this device. */
  function setupOfflineStatus() {
    const set = (text, state) => {
      document.querySelectorAll('[data-offline-status]').forEach(el => {
        el.textContent = text;
        el.dataset.state = state;
        const dot = el.parentElement && el.parentElement.querySelector('.sidebar-live-dot');
        if (dot) dot.dataset.state = state;
      });
      document.dispatchEvent(new CustomEvent('ll-offline-status', { detail: { text, state } }));
    };
    if (location.protocol === 'file:') { set('Running from files · works offline', 'ready'); return; }
    if (!('serviceWorker' in navigator) || !('caches' in window)) { set('This browser can’t save the guide for offline use', 'warn'); return; }

    const pf = detectPlatform();
    const ask = () => navigator.serviceWorker.ready.then(reg => {
      const sw = navigator.serviceWorker.controller || reg.active;
      if (sw) sw.postMessage({ type: 'offline-status' });
    });
    navigator.serviceWorker.addEventListener('message', e => {
      const d = e.data || {};
      if (d.type === 'precache-progress') {
        if (d.done < d.total) set(`Saving for offline… ${Math.round(d.done / d.total * 100)}%`, 'busy');
        else ask();
      } else if (d.type === 'offline-status') {
        if (d.missing === 0) set(pf.standalone ? 'Installed · ready offline' : 'Saved · ready offline', 'ready');
        else set(navigator.onLine ? 'Saving for offline…' : `Not fully saved — reconnect to finish`, navigator.onLine ? 'busy' : 'warn');
      }
    });
    navigator.serviceWorker.addEventListener('controllerchange', ask);
    window.addEventListener('online', ask);
    set(navigator.onLine ? 'Saving for offline…' : 'Checking offline storage…', 'busy');
    let answered = false;
    document.addEventListener('ll-offline-status', e => { if (e.detail.state !== 'busy') answered = true; });
    setTimeout(() => {
      if (!answered && !navigator.onLine) set('Not saved for offline yet — open once with internet', 'warn');
    }, 10000);
    ask();
  }

})();
