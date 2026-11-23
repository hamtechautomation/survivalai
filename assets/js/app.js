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
    knot:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9h11a3 3 0 010 6h-2.5"/><path d="M22 15H11a3 3 0 010-6h2.5"/></svg>`,
    target:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>`,
    fuel:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h11l3 3v10H4z"/><path d="M7 7V4h5"/><path d="M8 13l5 4M13 13l-5 4"/></svg>`,
    wrench:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z"/></svg>`,
    books:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h4V4H4zM10 4v16h4V4h-4z"/><path d="M17 6l3.5 14M17 6l3 1"/></svg>`,
    cloud:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17.5a4 4 0 00-1.3-7.78A6 6 0 005 9.5a4.5 4.5 0 00.5 8h11"/><path d="M12 12v6m0 0l-2.5-2.5M12 18l2.5-2.5"/></svg>`,
    projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l5-5"/><path d="M14.5 5.5l4 4M12.8 7.2l4 4-7.3 7.3a1.5 1.5 0 01-.7.4l-3.3.8.8-3.3a1.5 1.5 0 01.4-.7z"/><path d="M14.5 5.5l1.8-1.8a2 2 0 012.8 0l1.2 1.2a2 2 0 010 2.8L18.5 9.5z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
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
    prep:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>`,
    van:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17V8a2 2 0 012-2h11l5 5v6h-2"/><path d="M6 17h8"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/><path d="M15 6v5h5M6 9h5"/></svg>`,
    flats:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="10" height="18"/><path d="M14 9h6v12h-6M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1M17 13h0M17 17h0"/></svg>`,
    barn:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6v11H3z"/><path d="M9 21v-7h6v7M9 14l6 7M15 14l-6 7"/></svg>`,
    bunker:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9h20"/><path d="M5 9v2M19 9v2"/><path d="M4 21v-6a8 5 0 0116 0v6z"/><path d="M10 21v-4h4v4M16 5v4M14 5h4"/></svg>`,
    jar:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8v3H8z"/><path d="M7 6h10l1 3v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9z"/><path d="M6 12h12"/></svg>`,
    basket:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18l-2 9H5z"/><path d="M8 6l2-3M16 6l-2-3"/><circle cx="8" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><path d="M9 10v2M12 10v2M15 10v2"/></svg>`,
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

    { id: 'prepping',        href: 'sections/prepping.html',         icon: ICONS.prep,    label: 'Prepping: Start Here', section: 'Prepping' },
    { id: 'prep-24h',        href: 'sections/prep-24h.html',         icon: ICONS.clock,   label: 'First 24 Hours' },
    { id: 'prep-home',       href: 'sections/prep-home.html',        icon: ICONS.home,    label: 'The Prepped Home' },
    { id: 'prep-urban',      href: 'sections/prep-urban.html',       icon: ICONS.flats,   label: 'Urban & Flats' },
    { id: 'prep-van',        href: 'sections/prep-van.html',         icon: ICONS.van,     label: 'Campervan & Mobile' },
    { id: 'prep-rural',      href: 'sections/prep-rural.html',       icon: ICONS.barn,    label: 'Rural & Homestead' },
    { id: 'prep-bunkers',    href: 'sections/prep-bunkers.html',     icon: ICONS.bunker,  label: 'Bunkers & Shelter Rooms' },
    { id: 'prep-stockpile',  href: 'sections/prep-stockpile.html',   icon: ICONS.jar,     label: 'Stockpile & Rotation' },
    { id: 'prep-buy',        href: 'sections/prep-buy.html',         icon: ICONS.basket,  label: 'What to Buy' },

    { id: 'knowledge',        href: 'sections/knowledge.html',         icon: ICONS.book,     label: 'Knowledge & Literacy', section: 'Knowledge & Skills' },
    { id: 'science',          href: 'sections/science.html',           icon: ICONS.atom,     label: 'First Principles' },
    { id: 'knots',            href: 'sections/knots.html',             icon: ICONS.knot,     label: 'Knots & Rope' },

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
    { id: 'salvage',          href: 'sections/salvage.html',           icon: ICONS.wrench,   label: 'Salvage & Rebuild' },
    { id: 'fuel',             href: 'sections/fuel.html',              icon: ICONS.fuel,     label: 'Making Fuel' },
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
    injectNightFilter();
    injectManifest();
    buildNav();
    setActiveNav();
    setupPagination();
    setupBreadcrumb();
    recordRecent();
    ensureSearch();
    iconifyChrome();
    wrapTables();
    stackTables();
    setupSectionArt();
    setupHomeSky();
    setupOnThisPage();
    setupReveal();
    setupPlayers();
    setupKnotScrub();
    setupDiagrams();
    setupPalette();
    setupEmergency();
    setupNowStrip();
    if (document.querySelector('.calc[data-calc]')) loadScript('calc.js').catch(() => {});
    if (document.querySelector('.m3d[data-model]')) loadScript('model3d.js').catch(() => {});
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
    // In-page links like #sos-powercut open Emergency mode even before it has loaded.
    window.addEventListener('hashchange', () => { const m = /^#sos(?:-([a-z]+))?$/.exec(location.hash); if (m) openSOS(m[1]); });
    // Warm the cache so it's there offline even if never opened online.
    if ('requestIdleCallback' in window) requestIdleCallback(() => loadEmergency().catch(() => {}), { timeout: 4000 });
    else setTimeout(() => loadEmergency().catch(() => {}), 2500);
  }

  /* =================== "IF THIS IS HAPPENING NOW" STRIP ===================
     Big tappable cards under each section header. Red cards (s:) open the
     step-by-step emergency card; the others (#) jump to the part of the page
     that deals with it and flash it. Pages with no emergencies get "Start
     here" instead. Each entry: [target, title, subtitle, icon, tone]. */
  const NOW = {
    medical: ['now', [['s:bleeding', 'Heavy bleeding', 'Pressure, then tourniquet', 'firstaid', 'red'], ['s:cpr', 'Not breathing', 'Start CPR', 'heart', 'red'],
      ['s:choking', 'Choking', 'Back blows and thrusts', 'alert', 'red'], ['s:burn', 'Burn', 'Cool it for 20 minutes', 'fire', 'orange']]],
    maternal: ['now', [['#danger-birth', 'Birth going wrong', 'Bleeding, stuck, cord first', 'alert', 'red'], ['#newborn', 'Baby not breathing', 'Dry, warm, breathe for them', 'baby', 'red'],
      ['#infant-danger', 'Sick baby', 'Danger signs to act on', 'baby', 'orange'], ['s:dehydration', 'Diarrhoea', 'Rehydrate now', 'water', 'blue']]],
    food: ['now', [['#water-purification', 'Make water safe', 'Boil, bleach or sun', 'water', 'blue'], ['#water-sourcing', 'Find water', 'Where to look first', 'tap', 'blue'],
      ['s:dehydration', 'Diarrhoea', 'Oral rehydration', 'water', 'red'], ['#foraging', 'Is this plant safe?', 'Edibility rules and lookalikes', 'leaf', 'amber']]],
    'build-water': ['start', [['#testing', 'Is it safe to drink?', 'Treat and test', 'water', 'blue'], ['#rainwater', 'Collect rain', 'Roof, gutter, tank', 'cloud', 'blue'],
      ['#firstflush', 'First flush', 'Throw the dirty water away', 'tap', 'amber'], ['#wells', 'Dig a well', 'Siting and lining', 'hammer', 'amber']]],
    nbc: ['now', [['#nuclear', 'Flash or blast', 'Drop, cover, then get inside', 'nbc', 'red'], ['#fallout', 'Fallout coming', 'Shelter and the 7-10 rule', 'nbc', 'red'],
      ['#ki-dosing', 'Iodine tablets', 'Who takes what, when', 'pill', 'orange'], ['#decon', 'Contaminated', 'Strip, wash, bag it', 'alert', 'orange']]],
    disasters: ['now', [['#earthquake', 'Earthquake', 'Drop, cover, hold on', 'alert', 'red'], ['#flood', 'Flood', 'Get high, stay out of water', 'water', 'blue'],
      ['#wildfire', 'Wildfire', 'Leave early or shelter', 'fire', 'red'], ['#grid-down', 'Grid down', 'First hours and days', 'energy', 'amber']]],
    security: ['now', [['#bug-out', 'Stay or go?', 'Four questions in order', 'compass', 'red'], ['#negotiation', 'Someone hostile', 'Talk it down', 'users', 'orange'],
      ['#opsec', 'Keep a low profile', 'What not to show', 'lock', 'amber'], ['#fortification', 'Secure the house', 'Doors, windows, safe room', 'shield', 'amber']]],
    psychology: ['now', [['#breathing', 'Panic attack', 'Box breathing, now', 'brain', 'blue'], ['#suicide', 'Talking about suicide', 'Ask directly, stay with them', 'heart', 'red'],
      ['#grief', 'Grief', 'Helping someone through loss', 'heart', 'amber'], ['#children', 'Frightened children', 'What they need', 'baby', 'amber']]],
    climate: ['now', [['s:poison', 'Ate an unknown plant', 'Poisoning steps', 'alert', 'red'], ['#lookalikes', 'Deadly lookalikes', 'Check before you eat', 'leaf', 'orange'],
      ['#uk-hazards', 'Weather hazards', 'Floods, storms, heat', 'cloud', 'amber'], ['#uk-edibles', 'What to forage', 'Safe beginner plants', 'leaf', 'green']]],
    navigation: ['now', [['#fig-polaris', 'North at night', 'Find Polaris', 'compass', 'blue'], ['#fig-shadowstick', 'North by day', 'Shadow stick', 'solar', 'amber'],
      ['#compass', 'Use a compass', 'Bearings and declination', 'compass', 'amber'], ['#natural', 'No compass', 'Signs in nature', 'leaf', 'green']]],
    shelter: ['now', [['s:cold', 'Someone too cold', 'Hypothermia steps', 'snow', 'blue'], ['#emergency-shelters', 'Shelter tonight', 'Fast emergency shelters', 'tent', 'red'],
      ['#site-selection', 'Where to camp', 'Pick a safe site', 'map', 'amber'], ['#insulation', 'Stay warm', 'Insulate and seal', 'home', 'amber']]],
    'medicine-making': ['now', [['#ors', 'Diarrhoea', 'Make rehydration drink', 'water', 'red'], ['#fever', 'Fever', 'Cool, not cold', 'medical', 'orange'],
      ['#antiseptics', 'Clean a wound', 'Saline, honey, iodine', 'firstaid', 'amber'], ['#pain', 'Pain', 'What helps, safely', 'pill', 'amber']]],
    veterinary: ['now', [['#sick', 'Is it sick?', 'Signs to look for', 'paw', 'orange'], ['#birthing', 'Birth going wrong', 'When and how to help', 'alert', 'red'],
      ['#wounds', 'Wounded animal', 'Clean and close', 'firstaid', 'amber'], ['#vitals', 'Normal vitals', 'Temperature, pulse, breathing', 'heart', 'amber']]],
    communications: ['now', [['#baofeng', 'Call for help', 'Handheld radio', 'radio', 'red'], ['#visual-signals', 'Signal rescuers', 'Fire, mirror, ground marks', 'target', 'orange'],
      ['#morse', 'SOS in Morse', '··· ––– ···', 'radio', 'amber'], ['#ham-radio', 'Radio basics', 'Bands and range', 'comms', 'amber']]],
    energy: ['now', [['#generators', 'Running a generator', 'Outdoors only — carbon monoxide', 'alert', 'red'], ['#rocket-stove', 'Cook on little fuel', 'Rocket stove', 'fire', 'orange'],
      ['#solar', 'Solar power', 'Size and wire a system', 'solar', 'amber'], ['#batteries', 'Batteries', 'Keep them alive', 'energy', 'amber']]],
    chemistry: ['now', [['#compat', 'What not to mix', 'Toxic gas combinations', 'alert', 'red'], ['#cleaning', 'Disinfect', 'Bleach, vinegar, lye', 'flask', 'blue'],
      ['#soap', 'Make soap', 'From ash and fat', 'flask', 'amber'], ['#charcoal', 'Charcoal', 'Fuel and filters', 'fire', 'amber']]],
    knots: ['start', [['#which-knot', 'Which knot?', 'Pick by job', 'knot', 'amber'], ['#fig-bowline', 'Fixed loop', 'Bowline', 'knot', 'blue'],
      ['#fig-clove', 'Tie to a post', 'Clove hitch', 'knot', 'blue'], ['#fig-trucker', 'Tie a load down', 'Trucker’s hitch', 'knot', 'blue']]],
    animal: ['start', [['#chickens', 'Chickens', 'Eggs and meat', 'paw', 'amber'], ['#goats', 'Goats', 'Milk on rough ground', 'paw', 'amber'], ['#feed', 'Feed', 'Without buying it', 'leaf', 'green'], ['#veterinary', 'Sick animal', 'First checks', 'vet', 'red']]],
    agriculture: ['start', [['#soil-testing', 'Test your soil', 'Jar and ribbon tests', 'leaf', 'amber'], ['#planting-calendar', 'What to plant', 'Month by month', 'calendar', 'green'],
      ['#companion-planting', 'Companions', 'What grows well together', 'leaf', 'green'], ['#seed-saving', 'Save seed', 'Next year’s crop', 'leaf', 'amber']]],
    'build-power': ['start', [['#quick-ref', 'Quick reference', 'Every build at a glance', 'clipboard', 'amber'], ['#pedal', 'Pedal power', 'A bike generator', 'energy', 'amber'], ['#wind', 'Wind', 'A small turbine', 'energy', 'blue'], ['#biogas', 'Biogas', 'Fuel from waste', 'fire', 'green']]],
    'build-structures': ['start', [['#emergency', 'Shelter fast', 'Emergency builds', 'tent', 'red'], ['#site', 'Choose a site', 'Before you build', 'map', 'amber'], ['#earthbag', 'Earthbag', 'Strong and cheap', 'building', 'amber'], ['#quick-ref', 'Quick reference', 'All builds compared', 'clipboard', 'amber']]],
    governance: ['start', [['#forming', 'Form a group', 'First meeting', 'users', 'amber'], ['#justice', 'Settle a dispute', 'The dispute ladder', 'columns', 'orange'], ['#roles', 'Who does what', 'Roles', 'user', 'amber'], ['#templates', 'Templates', 'Printable forms', 'file', 'amber']]],
    knowledge: ['start', [['#preserve', 'Save knowledge', 'What to keep, how', 'book', 'amber'], ['#teaching', 'Teach it', 'Pass skills on', 'users', 'amber'], ['#children', 'Children', 'Schooling without schools', 'baby', 'green'], ['#library', 'Build a library', 'What to collect', 'books', 'amber']]],
    metallurgy: ['start', [['#building-forge', 'Build a forge', 'Brake drum, bellows', 'fire', 'orange'], ['#basic-techniques', 'Basic forging', 'Draw, upset, bend', 'hammer', 'amber'], ['#heat-treating', 'Harden & temper', 'Colours and quench', 'fire', 'red'], ['#knife-making', 'Make a knife', 'Five stages', 'hammer', 'amber']]],
    projects: ['start', [['#waterfilter', 'Water filter', 'Biosand build', 'water', 'blue'], ['#toilets', 'Toilets', 'Latrines that work', 'home', 'amber'], ['#cooling', 'Cool food', 'Without power', 'snow', 'blue'], ['#firefighting', 'Fight a fire', 'Bucket brigade and more', 'fire', 'red']]],
    salvage: ['start', [['#safety', 'Stay safe', 'Before you salvage', 'alert', 'red'], ['#where', 'Where to look', 'Best sources', 'map', 'amber'], ['#gen-maintenance', 'Keep a generator going', 'Maintenance', 'wrench', 'amber'], ['#batteries', 'Rescue batteries', 'Test and revive', 'wrench', 'amber']]],
    prepping: ['start', [['#ladder', 'Where am I?', 'The readiness ladder', 'check', 'amber'], ['#where', 'My home', 'First five things to do', 'home', 'amber'], ['#plan', 'Make a plan', 'Print it for the fridge', 'clipboard', 'amber'], ['#drills', 'Practise', 'Weekend drills', 'clock', 'amber']]],
    'prep-24h': ['now', [['#powercut', 'Power cut', 'First steps', 'energy', 'amber'], ['#flood', 'Flood warning', 'Act at the warning', 'water', 'blue'], ['#gas', 'Gas leak or CO alarm', 'Out, then call', 'fire', 'red'], ['#snow', 'Stuck in snow', 'Stay with the car', 'snow', 'blue']]],
    'prep-home': ['start', [['#shutoffs', 'Find the shut-offs', 'Stopcock, gas, fuse box', 'alert', 'red'], ['#water', 'Water', 'How much, and where it hides', 'water', 'blue'], ['#warmth', 'No heating', 'Keep one room warm', 'fire', 'orange'], ['#grab-bag', 'Grab bag', 'What to pack', 'bag', 'amber']]],
    'prep-urban': ['start', [['#floor-load', 'Is my floor OK?', 'Water weight checker', 'alert', 'red'], ['#high-rise', 'High-rise', 'Lifts, pumps, fire', 'building', 'orange'], ['#get-home', 'Walk home', 'Bag and route', 'map', 'amber'], ['#stay-go', 'Stay or go?', 'When to leave a city', 'compass', 'amber']]],
    'prep-van': ['start', [['#gas-safety', 'Gas and CO', 'The things that kill', 'alert', 'red'], ['#power', 'How long can I last?', 'Battery and water', 'solar', 'amber'], ['#packing', 'Keep it packed', 'Always in the van', 'bag', 'amber'], ['#stopping', 'Where to stop', 'UK rules', 'map', 'amber']]],
    'prep-rural': ['start', [['#fuel', 'Fuel and the law', '30 L and 275 L limits', 'fuel', 'red'], ['#water', 'Your water', 'Springs, wells, pumps', 'water', 'blue'], ['#heat', 'Heat for a winter', 'Wood and stoves', 'fire', 'orange'], ['#cut-off', 'Cut off', 'When help is far', 'alert', 'amber']]],
    'prep-bunkers': ['start', [['#refuge', 'Refuge room', 'Start here, for little', 'home', 'amber'], ['#air', 'Air', 'The thing that kills first', 'alert', 'red'], ['#container', 'Shipping containers', 'Why they collapse', 'box', 'orange'], ['#law', 'The law', 'Planning and building rules', 'columns', 'amber']]],
    'prep-buy': ['start', [['#everyday', 'Everyday kit', 'Use it, and it’s ready', 'check', 'amber'], ['#vital', 'Vital kit', 'Buy once, keep', 'alert', 'red'], ['#budget-list', 'My shopping list', 'For your budget', 'wallet', 'amber'], ['#skip', 'Don’t bother', 'What to skip', 'stop', 'orange']]],
    'prep-stockpile': ['start', [['#planner', 'How much?', 'Stockpile planner', 'food', 'amber'], ['#shelf-life', 'How long?', 'Shelf-life table', 'clock', 'amber'], ['#dates', 'Best before?', 'And when to bin it', 'alert', 'red'], ['#rotation', 'Rotate', 'Oldest first tracker', 'calendar', 'amber']]],
    fuel: ['start', [['#which-fuel', 'Which fuel?', 'For your engine', 'fire', 'orange'], ['#biodiesel', 'Biodiesel', 'From used cooking oil', 'flask', 'amber'], ['#woodgas', 'Wood gas', 'Run an engine on wood', 'fire', 'amber'], ['#storage', 'Keep fuel usable', 'Storage and rotation', 'alert', 'amber']]],
    science: ['start', [['#ptable', 'Periodic table', 'Elements you can use', 'atom', 'blue'], ['#equations', 'Key equations', 'Physics and chemistry', 'atom', 'amber'], ['#maths', 'Maths', 'Practical methods', 'grid4', 'amber'], ['#constants', 'Constants', 'Numbers to know', 'clipboard', 'amber']]],
    textiles: ['start', [['#repair', 'Mend clothes', 'Patch and darn', 'scissors', 'amber'], ['#sewing', 'Sewing', 'Stitches that hold', 'scissors', 'amber'], ['#boots', 'Footwear', 'Repair or make', 'scissors', 'orange'], ['#quick-ref', 'Quick reference', 'At a glance', 'clipboard', 'amber']]],
    vehicles: ['start', [['#hierarchy', 'Which vehicle?', 'Best options, in order', 'car', 'amber'], ['#bicycles', 'Bicycles', 'Load and repair', 'wheel', 'green'], ['#engines', 'Engines', 'Keep them running', 'gear', 'amber'], ['#watercraft', 'Boats', 'Canoe, skiff, raft', 'water', 'blue']]]
  };
  function setupNowStrip() {
    const page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    const conf = NOW[page]; if (!conf) return;
    const [kind, items] = conf;
    const live = items.filter(([t]) => t.startsWith('s:') || document.getElementById(t.slice(1)));
    if (live.length < 2) return;
    const nav = document.createElement('nav');
    nav.className = 'now-strip no-print now-' + kind;
    nav.setAttribute('aria-label', kind === 'now' ? 'If this is happening now' : 'Start here');
    nav.innerHTML = '<p class="now-h">' + (kind === 'now' ? '<span class="now-dot"></span>If this is happening now' : 'Start here') + '</p><div class="now-grid"></div>';
    const grid = nav.lastChild;
    live.forEach(([t, title, sub, icon, tone], i) => {
      const sos = t.startsWith('s:');
      const el = document.createElement(sos ? 'button' : 'a');
      el.className = 'now-card now-' + tone;
      el.style.setProperty('--i', i);
      if (sos) { el.type = 'button'; el.addEventListener('click', () => window.LastLight.sos && window.LastLight.sos(t.slice(2))); }
      else el.href = t;
      el.innerHTML = '<span class="now-i">' + (ICONS[icon] || ICONS.alert) + '</span><span class="now-t">' + title + '</span><span class="now-s">' + sub + '</span><span class="now-go" aria-hidden="true">' + (sos ? 'Steps' : '→') + '</span>';
      grid.appendChild(el);
    });
    const head = document.querySelector('.section-header');
    const after = head || document.querySelector('.content-wrapper h1') ;
    if (after) after.after(nav); else return;
    // Jumping to a part of the page flashes it so the eye lands there.
    nav.addEventListener('click', e => {
      const a = e.target.closest('a.now-card'); if (!a) return;
      const target = document.getElementById(a.getAttribute('href').slice(1)); if (!target) return;
      target.classList.remove('now-flash'); void target.offsetWidth; target.classList.add('now-flash');
      setTimeout(() => target.classList.remove('now-flash'), 2200);
    });
  }

  /* =================== LIVING SECTION BADGES ===================
     Each section's badge (in the header art) gets its own small looping scene, drawn
     in a -24…24 box: .ba = line, .baf = filled, .bat = thin line. Motion classes are
     .bm-* in style.css (origin via --ox/--oy, timing via --t/--dl); all off for
     reduced motion and in print. Pages not listed keep their menu icon. */
  function gearPath(r, teeth, depth) {
    let d = '';
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = i * Math.PI / teeth, a1 = (i + 1) * Math.PI / teeth, R = i % 2 ? r - depth : r;
      d += (i ? 'L' : 'M') + (R * Math.cos(a0)).toFixed(1) + ' ' + (R * Math.sin(a0)).toFixed(1) + 'L' + (R * Math.cos(a1)).toFixed(1) + ' ' + (R * Math.sin(a1)).toFixed(1);
    }
    return d + 'Z';
  }
  const O = (x, y) => `--ox:${x}px;--oy:${y}px`;
  const BADGE = {
    food: `<path class="ba bm bm-bob" style="--t:3s" d="M0 -20 C6 -10 10 -5 10 0 A10 10 0 0 1 -10 0 C-10 -5 -6 -10 0 -20Z"/>` +
      [0, 1, 2].map(i => `<ellipse class="bat bm bm-ripple" style="${O(0, 17)};--t:3s;--dl:${i}s" cx="0" cy="17" rx="14" ry="3.5"/>`).join(''),
    'build-water': `<path class="ba" d="M-20 -14 H2 C7 -14 9 -11 9 -7 V-4"/><path class="ba" d="M-20 -8 H0 C2 -8 3 -7 3 -5 V-4"/>` +
      `<path class="baf bm bm-drip" style="--t:2.4s" d="M6 -1 C8 2 9 4 9 5 A3 3 0 0 1 3 5 C3 4 4 2 6 -1Z"/>` +
      `<ellipse class="bat bm bm-ripple" style="${O(6, 17)};--t:2.4s;--dl:.9s" cx="6" cy="17" rx="10" ry="2.6"/>`,
    medical: `<g class="bm bm-beat" style="${O(0, 0)};--t:1.4s"><path class="ba" d="M0 15 C-19 3 -21 -10 -12 -14 C-6 -16 -2 -12 0 -8 C2 -12 6 -16 12 -14 C21 -10 19 3 0 15Z"/></g>` +
      `<path class="bat bm bm-trace" style="--t:1.4s" pathLength="100" d="M-22 0 H-10 L-7 -6 L-4 7 L0 -11 L4 9 L7 0 H22"/>`,
    energy: `<g class="bm bm-flick" style="${O(0, 18)};--t:.9s"><path class="ba" d="M0 -19 C6 -11 12 -5 10 5 C9 12 4 17 0 17 C-4 17 -9 12 -10 5 C-11 -3 -5 -7 -3 -13 C-2 -8 1 -7 1 -10 C1 -13 -1 -16 0 -19Z"/></g>` +
      `<g class="bm bm-flick" style="${O(0, 16)};--t:.6s;--dl:-.3s"><path class="baf" opacity=".55" d="M0 -3 C4 2 6 6 5 10 C4 13 2 15 0 15 C-2 15 -5 13 -5 10 C-5 6 -2 3 0 -3Z"/></g>`,
    shelter: `<path class="ba" d="M-17 1 L0 -13 L17 1 M-12 -3 V17 H12 V-3"/><path class="bat" d="M-3 17 V9 H3 V17"/><path class="ba" d="M8 -6 V-13 H12 V-3"/>` +
      [0, 1, 2].map(i => `<circle class="bat bm bm-smoke" style="--t:4.5s;--dl:${i * 1.5}s" cx="10" cy="-16" r="2.6"/>`).join(''),
    communications: `<path class="ba" d="M0 -3 L-8 19 M0 -3 L8 19 M-5 10 H5"/><circle class="baf" cx="0" cy="-5" r="2.6"/>` +
      [[6, 0], [11, .35], [16, .7]].map(([r, d]) => `<path class="bat bm bm-wave" style="--t:2.2s;--dl:${d}s" d="M${-r} ${-5 - r * .8} A${r} ${r} 0 0 0 ${-r} ${-5 + r * .8} M${r} ${-5 - r * .8} A${r} ${r} 0 0 1 ${r} ${-5 + r * .8}"/>`).join(''),
    navigation: `<circle class="ba" r="19"/><path class="bat" d="M0 -19 V-15 M0 19 V15 M-19 0 H-15 M19 0 H15"/>` +
      `<g class="bm bm-needle" style="${O(0, 0)};--t:7s"><path class="baf" d="M0 -14 L3.6 0 L-3.6 0Z"/><path class="ba" style="stroke-width:1.6" d="M0 14 L3.6 0 L-3.6 0Z"/></g><circle class="baf" r="2"/>`,
    security: `<clipPath id="ba-cl"><path d="M0 -19 L15 -13 V0 C15 9 8 16 0 19 C-8 16 -15 9 -15 0 V-13 Z"/></clipPath>` +
      `<g clip-path="url(#ba-cl)"><rect class="baf bm bm-shine" style="--t:4s" x="-30" y="-24" width="8" height="48" opacity=".45" transform="skewX(-20)"/></g>` +
      `<path class="ba" d="M0 -19 L15 -13 V0 C15 9 8 16 0 19 C-8 16 -15 9 -15 0 V-13 Z"/><path class="ba" d="M-6 0 L-1 5 L7 -5"/>`,
    agriculture: `<path class="ba" d="M-18 15 H18"/><path class="ba bm bm-grow" style="--t:6s" pathLength="100" d="M0 15 C0 8 0 2 0 -6"/>` +
      `<g class="bm bm-leaf" style="${O(0, -1)};--t:6s"><path class="ba" d="M0 -1 C-8 -3 -13 -9 -11 -14 C-4 -12 -1 -7 0 -1Z"/><path class="ba" d="M0 -4 C7 -7 12 -12 11 -17 C4 -15 0 -10 0 -4Z"/></g>`,
    animal: [[-14, 14, 0], [-5, 7, .5], [3, 12, 1], [11, 3, 1.5]].map(([x, y, d]) => `<g class="bm bm-step" style="--t:3.2s;--dl:${d}s"><ellipse class="baf" cx="${x}" cy="${y}" rx="3.2" ry="2.6"/><circle class="baf" cx="${x - 3.2}" cy="${y - 4}" r="1.3"/><circle class="baf" cx="${x}" cy="${y - 5.2}" r="1.3"/><circle class="baf" cx="${x + 3.2}" cy="${y - 4}" r="1.3"/></g>`).join(''),
    veterinary: `<ellipse class="baf" cx="0" cy="5" rx="7" ry="6"/><circle class="baf" cx="-8" cy="-4" r="2.8"/><circle class="baf" cx="-3" cy="-9" r="2.8"/><circle class="baf" cx="3" cy="-9" r="2.8"/><circle class="baf" cx="8" cy="-4" r="2.8"/>` +
      `<circle class="bat bm bm-ripple" style="${O(0, 0)};--t:2.6s" r="18"/>`,
    maternal: `<g class="bm bm-rock" style="${O(0, -20)};--t:4s"><path class="ba" d="M5 -13 A13 13 0 1 0 5 13 A10 10 0 1 1 5 -13Z"/></g>` +
      [[13, -12, 0], [16, 3, .8], [9, 14, 1.6]].map(([x, y, d]) => `<path class="baf bm bm-twinkle" style="${O(x, y)};--t:2.4s;--dl:${d}s" d="M${x} ${y - 3.5} L${x + 1} ${y - 1} L${x + 3.5} ${y} L${x + 1} ${y + 1} L${x} ${y + 3.5} L${x - 1} ${y + 1} L${x - 3.5} ${y} L${x - 1} ${y - 1}Z"/>`).join(''),
    'medicine-making': `<g class="bm bm-grind" style="${O(0, 4)};--t:1.6s"><path class="ba" style="stroke-width:3.4" d="M2 2 L13 -16"/></g><path class="ba" d="M-16 0 H16 C16 10 8 17 0 17 C-8 17 -16 10 -16 0Z"/><path class="bat" d="M-6 21 H6"/>`,
    chemistry: `<path class="ba" d="M-5 -18 H5 M-3 -18 V-7 L-14 15 H14 L3 -7 V-18"/><path class="baf" opacity=".35" d="M-9 5 H9 L13 14 H-13Z"/>` +
      [[-4, 0], [3, .7], [0, 1.4]].map(([x, d]) => `<circle class="bat bm bm-bubble" style="--t:2.1s;--dl:${d}s" cx="${x}" cy="11" r="1.8"/>`).join(''),
    metallurgy: `<path class="ba" d="M-17 4 H9 C13 4 15 1 16 -1 H-9 C-13 -1 -16 1 -17 4Z M-6 4 L-8 15 H6 L4 4"/>` +
      `<g class="bm bm-strike" style="${O(18, -18)};--t:1.6s"><path class="ba" style="stroke-width:2.8" d="M18 -18 L3 -8"/><path class="baf" d="M4.3 -1.5 L9.1 -4.9 L1.7 -14.5 L-3.1 -11.1Z"/></g>` +
      [[-3, -7, -6, -13], [4, -6, 9, -12], [0, -6, 1, -15]].map(([x1, y1, x2, y2]) => `<path class="bat bm bm-spark" style="--t:1.6s" d="M${x1} ${y1} L${x2} ${y2}"/>`).join(''),
    textiles: `<path class="bat bm bm-flow" style="--t:1.2s" d="M-20 12 H20" stroke-dasharray="5 4"/><g class="bm bm-sew" style="--t:1.2s"><path class="ba" d="M-14 8 L13 -15"/><ellipse class="bat" cx="10" cy="-12.5" rx="2.4" ry="1.1" transform="rotate(-40 10 -12.5)"/></g>`,
    knots: `<path class="ba" style="stroke-width:5;opacity:.9" d="M-19 9 C-8 9 -2 -14 6 -10 C14 -6 6 6 -2 2 C-8 -1 2 -9 19 -9"/>` +
      `<path class="bat bm bm-flow" style="--t:1.8s;stroke:var(--bg-1);stroke-width:1.4" stroke-dasharray="3 4" d="M-19 9 C-8 9 -2 -14 6 -10 C14 -6 6 6 -2 2 C-8 -1 2 -9 19 -9"/>`,
    vehicles: `<g class="bm bm-spin" style="${O(0, -2)};--t:3s"><circle class="ba" cy="-2" r="15"/>` + [0, 60, 120].map(a => `<path class="bat" transform="rotate(${a} 0 -2)" d="M0 -17 V13"/>`).join('') + `<circle class="baf" cy="-2" r="3"/></g>` +
      `<path class="bat bm bm-flow" style="--t:.8s" stroke-dasharray="6 5" d="M-22 15 H22"/>`,
    'build-power': `<path class="ba" d="M0 -2 L-2 20 H2 Z"/><g class="bm bm-spin" style="${O(0, -4)};--t:2.6s">` + [0, 120, 240].map(a => `<path class="baf" transform="rotate(${a} 0 -4)" d="M0 -4 C2 -9 2 -16 0 -21 C-2 -16 -2 -9 0 -4Z"/>`).join('') + `</g><circle class="baf" cy="-4" r="2.4"/>`,
    'build-structures': [[-15, 9, 0], [1, 9, .3], [-7, 1, .6], [-15, -7, .9], [1, -7, 1.2]].map(([x, y, d]) => `<rect class="ba bm bm-stack" style="--t:5s;--dl:${d}s" x="${x}" y="${y}" width="14" height="7" rx="1"/>`).join('') + `<path class="ba" d="M-18 17 H18"/>`,
    projects: `<g class="bm bm-spin" style="${O(-6, -4)};--t:6s"><path class="ba" transform="translate(-6 -4)" d="${gearPath(11, 9, 3)}"/><circle class="bat" cx="-6" cy="-4" r="3.5"/></g>` +
      `<g class="bm bm-spin-r" style="${O(10, 11)};--t:4.67s"><path class="ba" transform="translate(10 11)" d="${gearPath(8, 7, 2.6)}"/><circle class="bat" cx="10" cy="11" r="2.4"/></g>`,
    salvage: `<path class="ba" d="M-6 6 L-2 -1 H6 L10 6 L6 13 H-2Z" transform="translate(-2 2)"/><g class="bm bm-rock" style="${O(2, 9)};--t:1.6s"><path class="ba" style="stroke-width:3.2" d="M4 4 L18 -14"/><path class="ba" d="M15 -19 A6 6 0 1 0 22 -11"/></g>`,
    fuel: `<path class="ba" d="M-12 -6 H4 L9 -1 V15 H-12Z"/><path class="ba" d="M-8 -6 V-11 H-1"/><path class="bat" d="M-8 3 L2 11 M2 3 L-8 11"/><path class="baf bm bm-drip" style="${O(14, 0)};--t:2.2s" d="M14 0 c-2.4 3.4 -2.4 6 0 6 c2.4 0 2.4 -2.6 0 -6z"/>`,
    science: `<circle class="baf" r="3"/>` + [[0, 3.5], [60, 5], [120, 4.2]].map(([a, t]) => `<g transform="rotate(${a})"><g class="bm bm-spin" style="${O(0, 0)};--t:${t}s"><ellipse class="bat" rx="20" ry="7"/><circle class="baf" cx="20" r="2"/></g></g>`).join(''),
    knowledge: `<path class="ba" d="M0 -12 C-6 -16 -14 -16 -19 -13 V13 C-14 10 -6 10 0 14 C6 10 14 10 19 13 V-13 C14 -16 6 -16 0 -12 Z M0 -12 V14"/>` +
      `<g class="bm bm-page" style="${O(0, 0)};--t:4s"><path class="bat" d="M0 -12 C5 -15 11 -15 16 -12 V12 C11 10 5 10 0 13"/></g>`,
    governance: `<path class="ba" d="M0 -16 V16 M-8 16 H8"/><g class="bm bm-tilt" style="${O(0, -14)};--t:5s"><path class="ba" d="M-17 -14 H17"/>` +
      `<path class="bat" d="M-17 -14 L-22 -2 M-17 -14 L-12 -2 M17 -14 L12 -2 M17 -14 L22 -2"/><path class="ba" d="M-23 -2 A6 4 0 0 0 -11 -2 Z M11 -2 A6 4 0 0 0 23 -2 Z"/></g>`,
    psychology: `<circle class="bat" r="19" stroke-dasharray="2 4"/><circle class="baf bm bm-breathe" style="${O(0, 0)};--t:16s" r="13" opacity=".35"/><circle class="ba bm bm-breathe" style="${O(0, 0)};--t:16s" r="13"/>`,
    climate: `<path class="ba" d="M-14 2 A7 7 0 0 1 -11 -11 A9 9 0 0 1 6 -14 A8 8 0 0 1 16 -4 A6 6 0 0 1 13 2 Z"/>` +
      [[-8, 0], [0, .5], [8, 1]].map(([x, d]) => `<path class="bat bm bm-rain" style="--t:1.5s;--dl:${d}s" d="M${x} 6 L${x - 2} 12"/>`).join(''),
    disasters: `<g class="bm bm-sway" style="${O(0, 18)};--t:3s">` + [[-16, -16, 32], [-13, -9, 26], [-10, -2, 20], [-7, 5, 14], [-4, 11, 8], [-2, 17, 4]].map(([x, y, w], i) => `<path class="ba bm bm-flow" style="--t:${(1 + i * .15).toFixed(2)}s" stroke-dasharray="${(w * .9).toFixed(0)} 4" d="M${x} ${y} H${x + w}"/>`).join('') + `</g>`,
    nbc: `<circle class="baf" r="3"/><g class="bm bm-spin" style="${O(0, 0)};--t:12s">` + [0, 120, 240].map(a => `<path class="baf" transform="rotate(${a})" d="M-5.2 -9 A10.4 10.4 0 0 1 5.2 -9 L9 -15.6 A18 18 0 0 0 -9 -15.6 Z"/>`).join('') + `</g>` +
      `<circle class="bat bm bm-ripple" style="${O(0, 0)};--t:3s" r="20"/>`,
    prepping: [
      `<path class="ba" d="M-16 0 L0 -14 L16 0 M-12 -3 V16 H12 V-3"/><path class="bat" d="M-3 16 V8 H3 V16"/>`,
      `<path class="ba" d="M-14 16 V-17 H2 V16 M2 -6 H14 V16 M-18 16 H18"/><path class="bat" d="M-9 -11 h2 M-3 -11 h2 M-9 -4 h2 M-3 -4 h2 M-9 3 h2 M-3 3 h2 M7 0 h2 M7 7 h2"/>`,
      `<path class="ba" d="M-20 9 V-6 C-20 -9 -18 -10 -16 -10 H6 L16 -1 H18 C20 -1 21 1 21 3 V9 H-20 Z"/><path class="bat" d="M-15 -5 H-4 M6 -10 V-1 H16"/><circle class="ba" cx="-11" cy="11" r="4"/><circle class="ba" cx="11" cy="11" r="4"/>`,
      `<path class="bat" d="M-22 -4 H22"/><path class="ba" d="M-14 17 V7 C-14 -1 14 -1 14 7 V17 Z M-3 17 V10 H3 V17"/><path class="ba" d="M9 -4 V-14 H14"/>`
    ].map((g, k) => `<g class="bm bm-cycle4${k ? ' bm-alt' : ''}" style="--t:10s;--dl:${k * 2.5 - 10}s">${g}</g>`).join(''),
    'prep-24h': `<circle class="ba" r="18"/>` + [0, 90, 180, 270].map(a => `<path class="bat" transform="rotate(${a})" d="M0 -18 V-14"/>`).join('') +
      `<g class="bm bm-spin" style="${O(0, 0)};--t:6s"><path class="ba" d="M0 0 V-13"/></g><g class="bm bm-spin" style="${O(0, 0)};--t:72s"><path class="ba" style="stroke-width:3" d="M0 0 H8"/></g><circle class="baf" r="2.4"/>`,
    'prep-home': `<path class="ba" d="M-17 1 L0 -14 L17 1 M-12 -3 V17 H12 V-3"/><rect class="bat" x="-8" y="2" width="7" height="7"/>` +
      `<rect class="baf bm bm-twinkle" style="${O(-4.5, 5.5)};--t:3s" x="-8" y="2" width="7" height="7" opacity=".55"/>` +
      `<path class="ba bm bm-grow" style="--t:4s" pathLength="100" d="M2 9 L5.5 12.5 L12 5"/>`,
    'prep-urban': `<path class="ba" d="M-15 18 V-18 H1 V18 M1 -7 H15 V18 M-20 18 H20"/>` +
      [[-10, -13], [-4, -13], [-10, -6], [-4, -6], [-10, 1], [-4, 1], [-10, 8], [6, -2], [10, 5], [6, 11]].map(([x, y], k) =>
        `<rect class="baf bm bm-step" style="--t:4s;--dl:${(k * .37).toFixed(2)}s" x="${x}" y="${y}" width="3" height="3"/>`).join(''),
    'prep-van': `<g class="bm bm-bob" style="--t:.7s"><path class="ba" d="M-20 7 V-8 C-20 -11 -18 -12 -16 -12 H6 L16 -3 H18 C20 -3 21 -1 21 1 V7 H-20 Z"/><path class="bat" d="M-15 -7 H-4 M6 -12 V-3 H16"/></g>` +
      `<g class="bm bm-spin" style="${O(-11, 9)};--t:.8s"><circle class="ba" cx="-11" cy="9" r="4"/><path class="bat" d="M-11 5 V13"/></g><g class="bm bm-spin" style="${O(11, 9)};--t:.8s"><circle class="ba" cx="11" cy="9" r="4"/><path class="bat" d="M11 5 V13"/></g>` +
      `<path class="bat bm bm-flow" style="--t:.6s" stroke-dasharray="6 5" d="M-22 17 H22"/>`,
    'prep-rural': `<path class="ba" d="M-20 17 V0 L-10 -8 L0 0 V17 Z M-14 17 V9 H-6 V17"/><path class="ba" d="M11 17 L13 -6 H15 L17 17 M-22 17 H22"/>` +
      `<g class="bm bm-spin" style="${O(14, -7)};--t:4s">` + [0, 90, 180, 270].map(a => `<path class="ba" transform="rotate(${a} 14 -7)" d="M14 -7 V-19"/>`).join('') + `</g>`,
    'prep-bunkers': `<path class="bat" d="M-22 -4 H22"/><path class="ba" d="M-15 18 V8 C-15 -1 15 -1 15 8 V18 Z"/><path class="ba" d="M-9 -4 V-14 H-4 M9 -4 V-11"/><path class="bat" d="M-3 18 V11 H3 V18"/>` +
      `<path class="bat bm bm-flow" style="--t:1.2s" stroke-dasharray="3 3" d="M-6.5 -12 V4"/><path class="bat bm bm-flow" style="--t:1.2s" stroke-dasharray="3 3" d="M9 4 V-12"/>`,
    'prep-buy': `<path class="ba" d="M-18 -8 H18 L14 10 H-14 Z"/><path class="bat" d="M-9 -8 L-5 -16 M9 -8 L5 -16"/><circle class="baf" cx="-8" cy="16" r="2.4"/><circle class="baf" cx="9" cy="16" r="2.4"/>` +
      [[-8, 0], [0, .6], [8, 1.2]].map(([x, d]) => `<rect class="baf bm bm-stack" style="--t:4s;--dl:${d}s" x="${x - 3}" y="-6" width="6" height="12" rx="1.5" opacity=".8"/>`).join(''),
    'prep-stockpile': [[-15, 9, 0], [1, 9, .3], [-7, 1, .6], [-15, -7, .9], [1, -7, 1.2]].map(([x, y, d]) =>
      `<g class="bm bm-stack" style="--t:5s;--dl:${d}s"><rect class="ba" x="${x + 1}" y="${y}" width="12" height="7" rx="1.5"/><path class="bat" d="M${x + 1} ${y + 3.5} H${x + 13}"/></g>`).join('') +
      `<path class="ba" d="M-18 17 H18"/>`
  };

  /* =================== LIVING SKY ===================
     On Navigation (.sky-panel): a sky that follows this device's clock (night, dawn,
     day, dusk), twinkling stars, the sun crossing by day, tonight's real moon phase
     (worked out offline from the date), and a hillside shelter whose lantern glows
     brighter after dark. Refreshes every minute. Still for reduced motion. */
  function moonNow(d) {
    const P = 29.530588853, age = (((d - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % P + P) % P;
    const lit = (1 - Math.cos(2 * Math.PI * age / P)) / 2;
    const wax = age < P / 2;                         // named by how much is lit, as people see it
    const name = lit < .03 ? 'new moon' : lit > .97 ? 'full moon' : lit < .45 ? (wax ? 'waxing crescent' : 'waning crescent') : lit <= .55 ? (wax ? 'first quarter' : 'last quarter') : (wax ? 'waxing gibbous' : 'waning gibbous');
    return { age, lit, P, name };
  }
  function setupHomeSky() {
    const panel = document.querySelector('.sky-panel'); if (!panel || panel.querySelector('.home-sky')) return;
    const sky = document.createElement('div'); sky.className = 'home-sky no-flip'; sky.setAttribute('aria-hidden', 'true');
    panel.insertBefore(sky, panel.firstChild);
    const note = document.createElement('p'); note.className = 'sky-note';
    panel.appendChild(note);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const stars = Array.from({ length: 70 }, () => [rnd() * 800, rnd() * 190, .4 + rnd() * 1.1, rnd() * 6]);
    const KEYS = [[0, '#05080f', '#0a1324'], [4.5, '#05080f', '#0b1426'], [6, '#141a36', '#7a4a5a'], [7.3, '#1f3150', '#b8735a'], [9, '#1c3756', '#3d6c92'], [16, '#1c3756', '#3d6c92'],
                  [18, '#241f45', '#c46c45'], [19.5, '#120f2a', '#4a2e52'], [21, '#070b18', '#121a33'], [24, '#05080f', '#0a1324']];
    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
    function draw() {
      const now = new Date(), h = now.getHours() + now.getMinutes() / 60;
      let j = 0; while (j < KEYS.length - 2 && h >= KEYS[j + 1][0]) j++;
      const [h0, t0, b0] = KEYS[j], [h1, t1, b1] = KEYS[j + 1], t = (h - h0) / (h1 - h0);
      const top = mix(t0, t1, t), bot = mix(b0, b1, t);
      const night = h < 5 || h >= 21 ? 1 : h < 7 ? (7 - h) / 2 : h >= 19 ? (h - 19) / 2 : 0;            // 0 by day, 1 at night
      const sunUp = h > 6 && h < 18.5, sf = (h - 6) / 12.5, sx = 60 + 680 * sf, sy = 180 - 118 * Math.sin(Math.PI * Math.min(1, Math.max(0, sf))) - (Math.abs(sx - 400) < 140 ? 0 : 0);
      const m = moonNow(now), k = Math.cos(2 * Math.PI * m.age / m.P), waxing = m.age < m.P / 2, R = 15;
      const mx = 120 + 560 * ((h + 6) % 24) / 24, my = 46 + 30 * Math.abs(((h + 6) % 24) / 12 - 1);
      const moonLit = 'M0 ' + -R + ' A' + R + ' ' + R + ' 0 0 1 0 ' + R + ' A' + (R * Math.abs(k)).toFixed(2) + ' ' + R + ' 0 0 ' + (k > 0 ? 0 : 1) + ' 0 ' + -R + 'Z';
      const glow = .3 + .7 * night;
      sky.innerHTML = '<svg viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice">' +
        '<defs><linearGradient id="hs-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bot + '"/></linearGradient>' +
        '<radialGradient id="hs-l"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".9"/><stop offset=".35" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="hs-s"><stop offset="0" stop-color="#fff2c0"/><stop offset=".4" stop-color="#ffd25a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="800" height="260" fill="url(#hs-g)"/>' +
        '<g opacity="' + night.toFixed(2) + '">' + stars.map(([x, y, r, d]) => '<circle class="hs-star" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" style="--dl:-' + d.toFixed(1) + 's"/>').join('') + '</g>' +
        (sunUp ? '<circle cx="' + sx.toFixed(0) + '" cy="' + sy.toFixed(0) + '" r="46" fill="url(#hs-s)" opacity="' + (.75 * (1 - night)).toFixed(2) + '"/><circle cx="' + sx.toFixed(0) + '" cy="' + sy.toFixed(0) + '" r="10" fill="#fff0b8" opacity="' + (.85 * (1 - night)).toFixed(2) + '"/>' : '') +
        (night > .15 && m.lit > .02 ? '<g transform="translate(' + mx.toFixed(0) + ' ' + my.toFixed(0) + ')' + (waxing ? '' : ' scale(-1 1)') + '" opacity="' + Math.min(1, night * 1.2).toFixed(2) + '"><circle r="' + R + '" fill="#1a2238" opacity=".8"/><path d="' + moonLit + '" fill="#efe7cf"/><circle r="' + (R + 9) + '" fill="#efe7cf" opacity="' + (.06 + .1 * m.lit).toFixed(2) + '"/></g>' : '') +
        '<path d="M0 214 C120 186 220 200 330 182 C440 164 520 194 620 178 C700 166 760 176 800 170 V260 H0Z" fill="#0d1410" opacity=".85"/>' +
        '<path d="M0 236 C160 214 300 232 420 220 C560 206 680 230 800 214 V260 H0Z" fill="#070b08"/>' +
        '<g transform="translate(560 168)"><path d="M-22 14 L0 -6 L22 14 Z" fill="#0a0f0b"/><rect x="-16" y="12" width="32" height="18" fill="#0a0f0b"/>' +
        '<circle class="hs-glow" cy="20" r="46" fill="url(#hs-l)" opacity="' + glow.toFixed(2) + '"/><rect x="-4" y="16" width="8" height="9" rx="1" fill="#ffcf6a" opacity="' + (.45 + .55 * night).toFixed(2) + '"/></g>' +
        '</svg>';
      const greet = h < 5 ? 'Still up' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
      note.textContent = greet + ' · ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + (h >= 17 || h < 7 ? 'tonight: ' : 'moon: ') + m.name + ', ' + Math.round(m.lit * 100) + '% lit';
    }
    draw(); setInterval(draw, 60000);
  }

  /* =================== SECTION BANNER ART =================== */
  /* A small animated scene on every section header, generated from the
     page's own menu icon and its group's colour: drifting contour lines
     (a map), a glowing badge, rising embers. Pure SVG + CSS, no images. */
  const GROUP_TONE = {
    'Core Survival': 'amber', 'Knowledge & Skills': 'blue', 'Homesteading & Animals': 'green',
    'Prepping': 'khaki', 'Threats & Disasters': 'red', 'Trades & Materials': 'orange', 'Community & Mind': 'violet', 'Tools & Library': 'teal'
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
    const icon = BADGE[cur.id]
      ? `<svg x="${cx - 27}" y="${cy - 27}" width="54" height="54" viewBox="-24 -24 48 48" class="sa-icon sa-live" overflow="visible">${BADGE[cur.id]}</svg>`
      : (cur.icon || ICONS.book).replace('<svg ', `<svg x="${cx - 21}" y="${cy - 21}" width="42" height="42" class="sa-icon" `);
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

  /* =================== NIGHT-MODE RED FILTER =================== */
  /* Night mode must emit red light only, or it ruins dark-adapted eyes.
     Diagrams and images carry their own colours, so in Night mode CSS runs
     the content through this filter: every colour becomes a shade of red, with
     brightness preserved so nothing disappears. (style.css: url(#ll-nv)) */
  function injectNightFilter() {
    if (document.getElementById('ll-nv')) return;
    const d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0" focusable="false"><filter id="ll-nv" color-interpolation-filters="sRGB">' +
      // 1) brightness of any colour → red channel (scaled so nothing clips)
      '<feColorMatrix type="matrix" values="0.571 0.321 0.107 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>' +
      // 2) tone curve: Night-mode reds pass through almost unchanged, darks stay dark,
      //    and bright fills keep some shading instead of all clipping to full red
      '<feComponentTransfer><feFuncR type="table" tableValues="0 0.10 0.30 0.55 0.74 0.86 0.93 0.97 1"/></feComponentTransfer>' +
      '</filter></svg>';
    document.body.appendChild(d);
  }

  /* =================== DIAGRAMS =================== */
  /* Every hand-drawn diagram gets three things:
     1. Tap (or the Enlarge button) opens it full screen; pinch, wheel or the
        +/- buttons zoom, drag pans. Back button or Esc closes.
     2. Lines draw themselves in the first time it scrolls into view.
        Off for "reduce motion" and when printing.
     3. Parts tagged data-hl="key" light up together with their label when
        you hover, tap or focus either one. */
  const DG_SKIP = 'h1, h2, h3, a, button, .kn-tie, .home-sky, .hero-scene, .sec-art, .sos, .palette, .otp-bar, .dg-lb, [class*="icon"], .hero-stat';
  function isDiagram(svg) {
    if (svg.closest(DG_SKIP)) return false;
    const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
    if (svg.closest('.dg-cols')) return vb.length === 4;          // a panel of a split figure, whatever its size
    return vb.length === 4 && vb[2] >= 150 && vb[3] >= 60;
  }
  function diagramTitle(svg) {
    const fig = svg.closest('figure');
    if (fig && fig.classList.contains('dg-player')) return svg.getAttribute('aria-label') || 'Step by step';
    const cap = fig && fig.querySelector('figcaption');
    let t = '';
    if (cap) { const c = cap.cloneNode(true); c.querySelectorAll('.dg-hint').forEach(h => h.remove()); t = c.textContent.trim(); }
    return t || svg.getAttribute('aria-label') || 'Diagram';
  }

  function setupDiagrams() {
    const wrap = document.querySelector('.content-wrapper') || document.querySelector('main');
    if (!wrap) return;
    const svgs = [...wrap.querySelectorAll('svg[viewBox]')].filter(isDiagram);
    if (!svgs.length) return;

    // ── 1. enlarge ──
    svgs.forEach(svg => {
      svg.classList.add('dg-zoomable');
      const group = svg.closest('.dg-cols');
      // Panels of one figure: on a wide screen enlarge them together (it is a comparison); on a phone they
      // are already stacked full-width, so enlarge just the one that was tapped.
      const target = () => (group && !window.matchMedia('(max-width: 600px)').matches) ? group : svg;
      if (group) {
        svg.addEventListener('click', e => { if (e.target.closest('[data-hl]')) return; openLightbox(target(), svg); });
        if (!group.dataset.zoomBtn) {
          group.dataset.zoomBtn = '1';
          const fig = group.closest('figure'); if (getComputedStyle(fig).position === 'static') fig.style.position = 'relative';
          const gb = document.createElement('button'); gb.type = 'button'; gb.className = 'dg-enlarge no-print'; gb.setAttribute('aria-label', 'Enlarge diagram');
          gb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><span>Enlarge</span>';
          gb.addEventListener('click', e => { e.stopPropagation(); openLightbox(group, gb); });
          fig.appendChild(gb);
          const cap = fig.querySelector('figcaption');
          if (group.querySelector('[data-hl]') && cap && !cap.querySelector('.dg-hint')) cap.insertAdjacentHTML('afterbegin', '<span class="dg-hint no-print">Tap a feature to see where it is. </span>');
        }
        return;
      }
      const host = svg.parentElement;
      const small = svg.getBoundingClientRect().width > 0 && svg.getBoundingClientRect().width < 340;   // small cards: tap to enlarge, no button over the art
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dg-enlarge no-print' + (small ? ' dg-enlarge-hidden' : '');
      b.setAttribute('aria-label', 'Enlarge diagram');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><span>Enlarge</span>';
      b.addEventListener('click', e => { e.stopPropagation(); openLightbox(svg, b); });
      host.appendChild(b);
      svg.addEventListener('click', e => {
        if (e.target.closest('[data-hl]')) return;          // tapping a feature highlights instead
        if (window.getSelection && String(window.getSelection())) return;
        openLightbox(svg, b);
      });
      if (svg.querySelector('[data-hl]')) {
        const fig = svg.closest('figure');
        const cap = fig && fig.querySelector('figcaption');
        if (cap && !cap.querySelector('.dg-hint')) cap.insertAdjacentHTML('afterbegin', '<span class="dg-hint no-print">Tap a feature to see where it is. </span>');
      }
    });

    // ── 3. highlight (delegated, so it works in the enlarged copy too) ──
    let sticky = null;
    const setHl = (svg, key) => {
      svg.querySelectorAll('.hl').forEach(el => el.classList.remove('hl'));
      svg.classList.toggle('hl-on', !!key);
      if (key) svg.querySelectorAll('[data-hl="' + CSS.escape(key) + '"]').forEach(el => el.classList.add('hl'));
    };
    const hlTarget = e => { const t = e.target.closest && e.target.closest('[data-hl]'); return t && t.closest('svg') ? t : null; };
    document.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      const t = hlTarget(e); if (t) setHl(t.closest('svg'), t.dataset.hl);
    });
    document.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse') return;
      const t = hlTarget(e); if (!t) return;
      const svg = t.closest('svg');
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-hl="' + CSS.escape(t.dataset.hl) + '"]')) return;
      if (sticky && sticky.svg === svg) setHl(svg, sticky.key); else setHl(svg, null);
    });
    document.addEventListener('click', e => {
      const t = hlTarget(e);
      if (t) {
        const svg = t.closest('svg'), key = t.dataset.hl;
        if (sticky && sticky.svg === svg && sticky.key === key) { sticky = null; setHl(svg, null); }
        else { if (sticky && sticky.svg !== svg) setHl(sticky.svg, null); sticky = { svg, key }; setHl(svg, key); }
      } else if (sticky && !e.target.closest('.dg-lb-bar')) { setHl(sticky.svg, null); sticky = null; }
    });
    svgs.forEach(svg => svg.querySelectorAll('text[data-hl]').forEach(t => {
      t.setAttribute('tabindex', '0');
      t.addEventListener('focus', () => setHl(svg, t.dataset.hl));
      t.addEventListener('blur', () => setHl(svg, sticky && sticky.svg === svg ? sticky.key : null));
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    }));

    // ── 2. draw-in ──
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const vh = window.innerHeight;
    const pending = svgs.filter(svg => {
      if (svg.closest('.dg-cols')) return false;
      const r = svg.getBoundingClientRect();
      return r.width > 0 && r.top >= vh && !svg.closest('.no-js-only, .dg-player');
    });
    const finish = svg => {
      svg.classList.remove('dg-anim', 'dg-go');
      svg.querySelectorAll('.dgd, .dgf, .dgo').forEach(el => {
        el.classList.remove('dgd', 'dgf', 'dgo');
        if (el.dataset.dgPl) { el.removeAttribute('pathLength'); delete el.dataset.dgPl; }
        el.style.removeProperty('--dg-d'); el.style.removeProperty('--dg-fo'); el.style.removeProperty('--dg-op');
      });
    };
    const prepare = svg => {
      let i = 0;
      svg.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect, text').forEach(el => {
        if (el.closest('defs, marker, .sec-art, .no-anim') || el.classList.contains('dg-panel')) return;
        const cs = getComputedStyle(el);
        if (el.tagName === 'text' || cs.stroke === 'none' || cs.strokeWidth === '0px' || cs.strokeDasharray !== 'none') {
          el.classList.add('dgo');                                   // fade in
          el.style.setProperty('--dg-op', cs.opacity);
          el.style.setProperty('--dg-d', (el.tagName === 'text' ? 650 : 250) + Math.min(i, 40) * 10 + 'ms');
        } else {
          if (!el.hasAttribute('pathLength')) { el.setAttribute('pathLength', '1'); el.dataset.dgPl = '1'; }
          el.classList.add('dgd');                                   // draw stroke
          el.style.setProperty('--dg-d', Math.min(i, 60) * 12 + 'ms');
          if (cs.fill !== 'none' && cs.fillOpacity !== '0') { el.classList.add('dgf'); el.style.setProperty('--dg-fo', cs.fillOpacity); }
        }
        i++;
      });
      svg.classList.add('dg-anim');
    };
    const go = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const svg = e.target; go.unobserve(svg);
      requestAnimationFrame(() => { svg.classList.add('dg-go'); setTimeout(() => finish(svg), 2600); });
    }), { threshold: 0.25 });
    const near = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      near.unobserve(e.target); prepare(e.target); go.observe(e.target);
    }), { rootMargin: '0px 0px 400px 0px' });
    pending.forEach(svg => near.observe(svg));
    window.addEventListener('beforeprint', () => document.querySelectorAll('svg.dg-anim').forEach(finish));
  }

  /* Step-by-step diagrams: <figure class="dg dg-player" data-steps="N">.
     Parts carry data-s="a-b" (shown on steps a..b). Without JS, and in print,
     the finished state shows with every step listed underneath. */
  function setupPlayers() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('figure.dg-player').forEach(fig => {
      const n = +fig.dataset.steps || 1;
      const parts = [...fig.querySelectorAll('[data-s]')].map(el => {
        const [a, b] = el.dataset.s.split('-').map(Number);
        return { el, a, b: b || n };
      });
      const items = [...fig.querySelectorAll('.dg-steps-list > li')];
      const ctl = document.createElement('div');
      ctl.className = 'dg-ctl no-print';
      ctl.innerHTML =
        '<button type="button" class="dg-ctl-btn" data-a="prev" aria-label="Previous step">◀</button>' +
        '<button type="button" class="dg-ctl-btn dg-ctl-play" data-a="play" aria-label="Play">▶ Play</button>' +
        '<button type="button" class="dg-ctl-btn" data-a="next" aria-label="Next step">▶</button>' +
        '<span class="dg-ctl-pos" aria-live="polite"></span>' +
        '<span class="dg-ctl-bar"><i></i></span>';
      fig.querySelector('svg').after(ctl);
      const playBtn = ctl.querySelector('.dg-ctl-play'), pos = ctl.querySelector('.dg-ctl-pos'), bar = ctl.querySelector('.dg-ctl-bar i');
      let k = 1, timer = null;
      const STEP_MS = 3600;
      function show(i) {
        k = Math.max(1, Math.min(n, i));
        parts.forEach(p => p.el.classList.toggle('dg-off', k < p.a || k > p.b));
        items.forEach((li, j) => { li.classList.toggle('on', j === k - 1); li.classList.toggle('done', j < k - 1); });
        pos.textContent = 'Step ' + k + ' of ' + n;
        bar.style.width = (k / n * 100) + '%';
      }
      function setPlaying(on) {
        clearInterval(timer); timer = null;
        fig.classList.toggle('dg-playing', on);
        playBtn.textContent = on ? '❚❚ Pause' : (k === n ? '↺ Replay' : '▶ Play');
        playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
        if (on) timer = setInterval(() => { if (k >= n) setPlaying(false); else show(k + 1); if (k >= n) setPlaying(false); }, STEP_MS);
      }
      ctl.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'play') { if (timer) setPlaying(false); else { if (k === n) show(1); setPlaying(true); } return; }
        setPlaying(false); show(k + (b.dataset.a === 'next' ? 1 : -1)); setPlaying(false);
      });
      items.forEach((li, j) => {
        li.tabIndex = 0; li.setAttribute('role', 'button');
        const go = () => { setPlaying(false); show(j + 1); setPlaying(false); };
        li.addEventListener('click', go);
        li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      });
      fig.classList.add('dg-live');
      show(1); setPlaying(false);
      // Plays once by itself the first time it comes into view.
      if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(en => {
          if (en.isIntersecting) { io.disconnect(); if (k === 1 && !timer) setPlaying(true); }
        }), { threshold: 0.6 });
        io.observe(fig.querySelector('svg'));
      }
      window.addEventListener('beforeprint', () => { setPlaying(false); show(n); });
    });
  }

  /* =================== KNOTS THAT TIE THEMSELVES ===================
     Each knot player (sections/knots.html, built by tools/knots/build.py) also holds a
     "tie it" drawing in which every rope piece knows its strand and arc range. A slider
     moves through the step keyframes and lays the rope along its real path: crossings
     only cover once both passes are there, the whipped end rides the tip. "Turn it
     over" flips to the knot seen from behind (mirrored, every over now under). */
  function setupKnotScrub() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('figure.dg-knot').forEach(fig => {
      const tie = fig.querySelector('.kn-tie'); if (!tie) return;
      const svgs = [...tie.querySelectorAll('svg.kn-scrub')];
      const keys = JSON.parse(svgs[0].dataset.keys);
      const segW = keys.slice(1).map((k, j) => k.reduce((a, v, i) => a + Math.abs(v - keys[j][i]), 0) || 1);
      const total = segW.reduce((a, b) => a + b, 0);
      const views = svgs.map(svg => ({
        pcs: [...svg.querySelectorAll('.ks-pc')].map(g => ({ i: +g.dataset.i, a: +g.dataset.a, b: +g.dataset.b,
          need: g.dataset.need ? g.dataset.need.split(',').map(x => x.split(':').map(Number)) : null,
          r: [...g.querySelectorAll('.ks-r')], hi: g.querySelector('.ks-hi'), g })),
        bk: [...svg.querySelectorAll('.ks-bk')].map(p => ({ i: +p.dataset.i, a: +p.dataset.a, p })),
        tips: [...svg.querySelectorAll('.ks-tip')].map(g => ({ i: +g.dataset.i, g })),
        axes: [...svg.querySelectorAll('.ks-axis')].reduce((o, p) => (o[+p.dataset.i] = { p, len: +p.dataset.len, tl: p.getTotalLength() }, o), {})
      }));
      views.forEach(v => v.pcs.forEach(pc => {
        pc.r.forEach(p => { p.style.strokeDasharray = '100 101'; });
        const L = Math.max(1, pc.b - Math.max(0, pc.a - 0.7));      // shared path has pathLength 100: keep the 5/4 highlight stripes in real units
        if (pc.hi) pc.hi.style.strokeDasharray = (500 / L).toFixed(3) + ' ' + (400 / L).toFixed(3);
      }));
      function at(t) {                       // per-strand arc length at slider position t (0..1)
        let x = t * total, j = 0;
        while (j < segW.length - 1 && x > segW[j]) { x -= segW[j]; j++; }
        const f = Math.min(1, x / segW[j]);
        return keys[j].map((v, i) => v + (keys[j + 1][i] - v) * f);
      }
      function render(t) {
        const u = at(t), done = t >= 0.999;
        views.forEach(v => {
          v.pcs.forEach(pc => {
            const ok = !pc.need || pc.need.every(([i, s]) => u[i] >= s - 0.5);
            const f = ok ? Math.max(0, Math.min(1, (u[pc.i] - pc.a) / (pc.b - pc.a))) : 0;
            pc.g.style.display = f > 0 ? '' : 'none';
            pc.r.forEach(p => { p.style.strokeDashoffset = (100 * (1 - f)).toFixed(2); });
            pc.hi.style.opacity = done ? '' : '0';
          });
          v.bk.forEach(b => { b.p.style.opacity = u[b.i] > b.a + 1 ? '' : '0'; });
          v.tips.forEach(tp => {
            const ax = v.axes[tp.i]; if (!ax) return;
            const s = u[tp.i]; if (s < 2) { tp.g.style.display = 'none'; return; }
            const k = ax.tl / ax.len, p1 = ax.p.getPointAtLength(s * k), p0 = ax.p.getPointAtLength(Math.max(0, s - 4) * k);
            tp.g.style.display = '';
            tp.g.setAttribute('transform', 'translate(' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ') rotate(' + (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI).toFixed(1) + ')');
          });
        });
      }
      // controls
      const name = (svgs[0].getAttribute('aria-label') || 'the knot').replace(/, tying itself$/, '');
      const mode = document.createElement('div');
      mode.className = 'kn-mode no-print'; mode.setAttribute('role', 'tablist');
      mode.innerHTML = '<button type="button" role="tab" aria-selected="true" data-m="steps">Steps</button><button type="button" role="tab" aria-selected="false" data-m="tie">Watch it tie</button>';
      fig.insertBefore(mode, fig.firstChild);
      const bar = document.createElement('div');
      bar.className = 'kn-bar';
      bar.innerHTML = '<button type="button" class="dg-ctl-btn kn-play">▶ Play</button>' +
        '<input type="range" min="0" max="1000" value="1000" aria-label="How far ' + name + ' is tied">' +
        (svgs.length > 1 ? '<button type="button" class="dg-ctl-btn kn-turn" aria-pressed="false">↻ Turn it over</button>' : '');
      tie.appendChild(bar);
      const slider = bar.querySelector('input'), play = bar.querySelector('.kn-play'), turn = bar.querySelector('.kn-turn'), flip = tie.querySelector('.kn-flip');
      let raf = null;
      const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; play.textContent = +slider.value >= 1000 ? '↺ Replay' : '▶ Play'; };
      function run() {
        if (raf) { stop(); return; }
        if (+slider.value >= 1000) slider.value = 0;
        const t0 = performance.now(), v0 = +slider.value, dur = 9000 * (1 - v0 / 1000);
        play.textContent = '❚❚ Pause';
        const step = now => {
          const v = Math.min(1000, v0 + (now - t0) / dur * (1000 - v0));
          slider.value = v; render(v / 1000);
          if (v < 1000) raf = requestAnimationFrame(step); else { raf = null; stop(); }
        };
        raf = requestAnimationFrame(step);
      }
      slider.addEventListener('input', () => { stop(); render(+slider.value / 1000); });
      play.addEventListener('click', run);
      if (turn) turn.addEventListener('click', () => {
        const on = !flip.classList.contains('is-turned');
        flip.classList.toggle('is-turned', on); turn.setAttribute('aria-pressed', String(on));
        turn.textContent = on ? '↺ Turn it back' : '↻ Turn it over';
      });
      mode.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const tieOn = b.dataset.m === 'tie';
        mode.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
        fig.classList.toggle('kn-tying', tieOn); tie.hidden = !tieOn;
        const ps = fig.querySelector('.dg-ctl .dg-ctl-play');
        if (tieOn) { if (fig.classList.contains('dg-playing') && ps) ps.click(); slider.value = 0; render(0); if (!reduce) run(); else { slider.value = 1000; render(1); } }
        else stop();
      });
      render(1);
    });
  }

  let lb = null;
  function openLightbox(svg, returnFocus) {
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'dg-lb';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML =
        '<div class="dg-lb-bar"><p class="dg-lb-title"></p>' +
        '<button type="button" class="dg-lb-btn" data-z="-1" aria-label="Zoom out">−</button>' +
        '<button type="button" class="dg-lb-btn" data-z="0" aria-label="Fit to screen">Fit</button>' +
        '<button type="button" class="dg-lb-btn" data-z="1" aria-label="Zoom in">+</button>' +
        '<button type="button" class="dg-lb-btn dg-lb-x" aria-label="Close">✕</button></div>' +
        '<div class="dg-lb-stage"><div class="dg-lb-pan"></div></div>' +
        // step-by-step diagrams get their own controls here, so a propped-up phone can be driven by swipes
        '<div class="dg-lb-steps" hidden><p class="dg-lb-steptext" aria-live="polite"></p><div class="dg-lb-ctl">' +
        '<button type="button" class="dg-lb-pbtn" data-p="prev" aria-label="Previous step">◀</button>' +
        '<button type="button" class="dg-lb-pbtn dg-lb-play" data-p="play">▶ Play</button>' +
        '<button type="button" class="dg-lb-pbtn" data-p="next" aria-label="Next step">▶</button>' +
        '<span class="dg-lb-dots" aria-hidden="true"></span><span class="dg-lb-pos"></span></div></div>' +
        '<p class="dg-lb-help"></p>';
      document.body.appendChild(lb);
    }
    const stage = lb.querySelector('.dg-lb-stage'), pan = lb.querySelector('.dg-lb-pan');
    const clone = svg.cloneNode(true);
    clone.classList.remove('dg-anim', 'dg-go', 'hl-on', 'dg-zoomable');
    clone.classList.toggle('dg-keep', !!svg.closest('.plant-card, #fig-look-garlic, #fig-look-umbel, #fig-look-chanterelle'));   // true-colour art stays true in Daylight mode
    clone.querySelectorAll('.hl, .hl-on, .dg-zoomable').forEach(el => el.classList.remove('hl', 'hl-on', 'dg-zoomable'));
    clone.querySelectorAll('[tabindex]').forEach(el => el.setAttribute('tabindex', '0'));
    if (clone.tagName.toLowerCase() === 'svg') clone.removeAttribute('style');
    // sizing: the figure's own colour context (emergency tone etc.) can't follow, so copy the variable
    const sosc = getComputedStyle(svg).getPropertyValue('--sos-c'); if (sosc) clone.style.setProperty('--sos-c', sosc);
    pan.replaceChildren(clone);
    const title = diagramTitle(svg);
    lb.querySelector('.dg-lb-title').textContent = title;
    lb.setAttribute('aria-label', title.slice(0, 120));

    // ── step-by-step diagrams: a full-screen player ──
    const pfig = svg.closest('figure.dg-player');
    const stepsBox = lb.querySelector('.dg-lb-steps'), playBtn = lb.querySelector('.dg-lb-play');
    let pk = 1, pn = 0, ptimer = null, pparts = [], ptexts = [], wake = null;
    pan.classList.toggle('dg-live', !!pfig);
    stepsBox.hidden = !pfig;
    lb.classList.toggle('is-player', !!pfig);
    lb.querySelector('.dg-lb-help').textContent = pfig ? 'Swipe or use ◀ ▶ for steps · pinch to zoom · ✕ or Back to close' : 'Pinch or + / − to zoom · drag to move · ✕ or Back to close';
    const pshow = i => {
      pk = Math.max(1, Math.min(pn, i));
      pparts.forEach(q => q.el.classList.toggle('dg-off', pk < q.a || pk > q.b));
      lb.querySelector('.dg-lb-steptext').innerHTML = '<b>' + pk + '.</b> ' + (ptexts[pk - 1] || '');
      lb.querySelector('.dg-lb-pos').textContent = 'Step ' + pk + ' of ' + pn;
      lb.querySelector('.dg-lb-dots').innerHTML = ptexts.map((t, j) => '<i class="' + (j === pk - 1 ? 'on' : j < pk - 1 ? 'done' : '') + '"></i>').join('');
    };
    const pplay = on => {
      clearInterval(ptimer); ptimer = null;
      playBtn.textContent = on ? '❚❚ Pause' : '▶ Play';
      lb.classList.toggle('is-playing', on);
      if (on) {
        if (pk >= pn) pshow(1);
        let hold = 0;                                    // loops: the finished knot is held for two beats, then it starts again
        ptimer = setInterval(() => { if (pk >= pn) { if (++hold >= 2) { hold = 0; pshow(1); } } else pshow(pk + 1); }, 4200);
        if (navigator.wakeLock && !wake) navigator.wakeLock.request('screen').then(w => { wake = w; }).catch(() => {});
      } else if (wake) { wake.release().catch(() => {}); wake = null; }
    };
    if (pfig) {
      if (pfig.classList.contains('dg-playing')) { const ib = pfig.querySelector('.dg-ctl-play'); if (ib) ib.click(); }   // pause the one on the page
      pn = +pfig.dataset.steps || 1;
      pparts = [...clone.querySelectorAll('[data-s]')].map(el => { const [a, b] = el.dataset.s.split('-').map(Number); return { el, a, b: b || pn }; });
      const lis = [...pfig.querySelectorAll('.dg-steps-list > li')];
      ptexts = lis.map(li => li.innerHTML);
      pshow(Math.max(1, lis.findIndex(li => li.classList.contains('on')) + 1));
      pplay(false);
    }
    const onStep = e => {
      const b = e.target.closest('.dg-lb-pbtn'); if (!b) return;
      if (b.dataset.p === 'play') return pplay(!ptimer);
      pplay(false); pshow(pk + (b.dataset.p === 'next' ? 1 : -1));
    };

    let s = 1, x = 0, y = 0;
    const apply = () => { pan.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
    const zoomAt = (ns, cx, cy) => {
      ns = Math.max(1, Math.min(6, ns));
      const r = stage.getBoundingClientRect();
      const px = (cx === undefined ? r.width / 2 : cx - r.left), py = (cy === undefined ? r.height / 2 : cy - r.top);
      x = px - (px - x) * ns / s; y = py - (py - y) * ns / s; s = ns;
      if (s === 1) { x = 0; y = 0; }
      apply();
    };
    apply();

    const pts = new Map(); let last = null, lastTap = 0, swipe = null;
    const onDown = e => {
      if (e.target.closest('[data-hl]')) return;
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      swipe = pts.size === 1 ? { x: e.clientX, y: e.clientY, t: Date.now() } : null;
      if (pts.size === 1) {
        const now = Date.now();
        if (now - lastTap < 300) zoomAt(s > 1 ? 1 : 2.5, e.clientX, e.clientY);
        lastTap = now;
      }
      last = null;
    };
    const onMove = e => {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (last) zoomAt(s * d / last, mx, my);
        last = d;
      } else if (pts.size === 1 && s > 1) { x += e.clientX - prev.x; y += e.clientY - prev.y; apply(); }
    };
    const onUp = e => {
      pts.delete(e.pointerId); if (pts.size < 2) last = null;
      if (pfig && swipe && s === 1 && e.type === 'pointerup') {            // a sideways flick steps the diagram
        const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - swipe.t < 700) { pplay(false); pshow(pk + (dx < 0 ? 1 : -1)); lastTap = 0; }
      }
      swipe = null;
    };
    const onWheel = e => { e.preventDefault(); zoomAt(s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY); };
    const onBtn = e => {
      const b = e.target.closest('.dg-lb-btn'); if (!b) return;
      if (b.classList.contains('dg-lb-x')) return close();
      const z = +b.dataset.z; zoomAt(z === 0 ? 1 : s * (z > 0 ? 1.4 : 1 / 1.4));
    };
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === '+' || e.key === '=') zoomAt(s * 1.4);
      else if (e.key === '-') zoomAt(s / 1.4);
      else if (pfig && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); pplay(false); pshow(pk + (e.key === 'ArrowRight' ? 1 : -1)); }
      else if (pfig && e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); pplay(!ptimer); }
      else if (e.key === 'Tab') {                                     // keep focus inside
        const f = [...lb.querySelectorAll('button, [tabindex="0"]')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    const onPop = () => close(true);
    function close(fromHistory) {
      stage.removeEventListener('pointerdown', onDown); stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp); stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('wheel', onWheel); lb.removeEventListener('click', onBtn); lb.removeEventListener('click', onStep);
      document.removeEventListener('keydown', onKey); window.removeEventListener('popstate', onPop);
      lb.classList.remove('open', 'is-player', 'is-playing'); document.documentElement.classList.remove('dg-lb-open');
      pplay(false);
      if (pfig) { const li = pfig.querySelectorAll('.dg-steps-list > li')[pk - 1]; if (li) li.click(); }     // the page picks up where you left off
      pan.classList.remove('dg-live');
      pan.replaceChildren();
      if (fromHistory !== true && history.state && history.state.dgLb) history.back();
      if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
    }
    stage.addEventListener('pointerdown', onDown); stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp); stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('wheel', onWheel, { passive: false }); lb.addEventListener('click', onBtn); lb.addEventListener('click', onStep);
    document.addEventListener('keydown', onKey);
    try { history.pushState({ dgLb: 1 }, ''); window.addEventListener('popstate', onPop); } catch (e) {}
    document.documentElement.classList.add('dg-lb-open');
    lb.classList.add('open');
    lb.querySelector('.dg-lb-x').focus({ preventScroll: true });
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

  /* =================== TABLES → CARDS ON PHONES ===================
     A table with 3+ columns becomes a stack of cards below 640px: the first
     cell is the card's heading and every other cell is shown with its column
     name as a label (CSS reads data-label). Tables with merged cells, or marked
     .no-stack, keep sideways scrolling. Print and wide screens are unchanged. */
  function stackTables() {
    document.querySelectorAll('.main-content table, .content-wrapper table').forEach(t => {
      if (t.classList.contains('no-stack') || t.closest('.dg, figure, .no-stack') || t.querySelector('[rowspan],[colspan]')) return;
      const rows = [...t.rows];
      if (rows.length < 2) return;
      let head = t.tHead && t.tHead.rows[0];
      if (!head && [...rows[0].cells].every(c => c.tagName === 'TH')) head = rows[0];
      if (!head) return;
      const names = [...head.cells].map(c => c.textContent.replace(/\s+/g, ' ').trim());
      if (names.length < 3) return;
      rows.forEach(r => {
        if (r === head) { r.classList.add('tbl-head'); return; }
        [...r.cells].forEach((c, i) => {
          if (!names[i]) return;
          c.setAttribute('data-label', names[i]);
          if (i > 0 && c.childNodes.length) {          // one wrapper, so the label/value grid has exactly two items
            const v = document.createElement('div'); v.className = 'tbl-v';
            while (c.firstChild) v.appendChild(c.firstChild);
            c.appendChild(v);
          }
        });
      });
      t.classList.add('tbl-stack');
      const w = t.closest('.table-scroll, .table-wrap'); if (w) w.classList.add('tbl-stack-wrap');
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
      ? `<a href="/home.html" class="sidebar-toplink" title="Back to the front page"
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
    /* "Install on your phone" sits at the foot of the nav so it's always one
       tap away. Uses the browser's own install prompt when it offers one;
       otherwise (iPhone, Firefox…) it opens the step-by-step for this device.
       Hidden once running as the installed app. */
    const pf = detectPlatform();
    const installHTML = pf.standalone ? '' : `
        <a href="${base}download.html#install-phone" class="sidebar-install" id="sidebar-install">
          ${ICONS.phone}<span class="si-text"><strong>Install on your phone</strong><small>Works with no signal</small></span>
        </a>`;
    const footerHTML = `
      <div class="sidebar-footer">${installHTML}
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
    const installBtn = sidebar.querySelector('#sidebar-install');
    if (installBtn) {
      installBtn.addEventListener('click', e => {
        // Follow the link to the guide unless this phone's browser can install directly.
        if (pf.os === 'desktop' || !window.LastLight.canPrompt()) return;
        e.preventDefault();
        window.LastLight.promptInstall();
      });
      document.addEventListener('ll-installable', () => {
        if (installState.installed) installBtn.remove();
      });
    }
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
  // The browser's own toolbar colour follows the display mode.
  function syncThemeColor() {
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    const b = document.body.classList;
    m.content = b.contains('mode-day') ? '#f5f8f7' : b.contains('mode-nv') ? '#110000' : b.contains('mode-hc') ? '#000000' : '#070a09';
  }

  function setupModeBar() {
    const savedMode = localStorage.getItem('display-mode') || '';
    const savedFont = localStorage.getItem('font-size') || '';
    if (savedMode) document.body.classList.add(savedMode);
    syncThemeColor();
    if (savedFont) document.body.classList.add(savedFont);

    const controls = `
      <div class="display-group" role="group" aria-label="Colour mode">
        <span class="display-label">Colours</span>
        <div class="seg">
          <button type="button" data-mode="" title="Normal colours (dark)">Normal</button>
          <button type="button" data-mode="mode-day" title="Daylight — dark text on a light page, for reading outdoors in bright sun">Daylight</button>
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
      syncThemeColor();
    };
    root.querySelectorAll('[data-mode]').forEach(b => {
      const on = b.dataset.mode === savedMode;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', () => pick('data-mode', ['mode-hc', 'mode-nv', 'mode-day'], 'display-mode', b.dataset.mode));
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
