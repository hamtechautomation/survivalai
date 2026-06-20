FONTS
=====
This guide uses system fonts only:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
  'Courier New', Courier, monospace (for code/diagrams)

No external font files required. These fonts are built into every operating system.

TO EMBED A CUSTOM FONT (optional, for consistent cross-platform rendering):
1. Download .woff2 file from a licensed source (e.g. Google Fonts downloaded locally)
2. Convert to base64: base64 font.woff2 | tr -d '\n'
3. Add to assets/css/style.css at the top:

   @font-face {
     font-family: 'YourFont';
     src: url('data:font/woff2;base64,AAAA...') format('woff2');
     font-display: swap;
   }

   Then update --font variable: --font: 'YourFont', system-ui, sans-serif;

RECOMMENDED FREE FONTS (download before grid-down):
- Inter (UI text): fonts.google.com/specimen/Inter
- Fira Code (monospace): fonts.google.com/specimen/Fira+Code
