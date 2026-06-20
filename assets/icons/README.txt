ICONS
=====
This guide uses ONLY inline SVG and Unicode emoji for all icons.
Zero external icon font CDNs (Font Awesome, Material Icons, Bootstrap Icons, etc.)

HOW ICONS ARE USED:
- Navigation icons: Unicode emoji (🏠 📻 🧭 ⚡ 🌱 etc.) in app.js NAV_PAGES array
- Diagram icons: Inline SVG embedded directly in HTML section files
- Favicon: data: URI SVG in <link rel="icon"> tags

All icons render without any network request, ensuring 100% offline functionality.

TO ADD A CUSTOM INLINE SVG ICON:
1. Get or draw your SVG (keep it simple, single path preferred)
2. Optimize with SVGO or similar
3. Paste inline in HTML: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="..."/></svg>
4. Use currentColor for stroke/fill to inherit text color

EMOJI COMPATIBILITY NOTE:
Emoji rendering varies by OS. The guide has been tested on:
- macOS 12+ (excellent emoji)
- Windows 10/11 (good emoji via Segoe UI Emoji)
- Ubuntu 20+ (good emoji via Noto Color Emoji)
- Android/iOS browsers (excellent)
