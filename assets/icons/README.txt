ICONS
=====
App / home-screen icons (vector bolt, no emoji, so they look the same on every device):

  icon.svg               master icon (rounded square)    — favicon, manifest "any"
  icon-maskable.svg      full-bleed, bolt in safe zone   — source for the maskable PNG
  icon-192.png           Android home screen / shortcuts
  icon-512.png           Android splash / install sheet
  icon-maskable-512.png  Android adaptive (masked) icon
  apple-touch-icon.png   180x180, iPhone/iPad home screen (iOS ignores SVG here)
  favicon-32.png         browser tab fallback

If you change icon.svg / icon-maskable.svg, re-render the PNGs at those sizes
(any SVG renderer; e.g. open the SVG in Chrome and screenshot at the size).

UI icons inside the guide are inline SVG line icons (ICONS in assets/js/app.js).
Emoji that start a label are swapped for those icons at load (iconifyEmoji).
