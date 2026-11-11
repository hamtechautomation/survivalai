FONTS
=====
Self-hosted so the guide looks the same everywhere, works offline and from file://.
All three are licensed under the SIL Open Font License 1.1 (see OFL-*.txt here).

  inter-latin-wght-normal.woff2          Inter — body/UI text (variable weight)
  bitter-latin-wght-normal.woff2         Bitter — headings (variable-weight slab serif)
  jetbrains-mono-latin-wght-normal.woff2 JetBrains Mono — code, numbers, diagrams

Source: the Fontsource npm packages (@fontsource-variable/inter, /bitter,
/jetbrains-mono, v5.1.0), Latin subset only (~120 KB total). Characters outside
the subset fall back to the system font automatically.

They are wired up with @font-face at the top of assets/css/style.css; change the
--font / --font-display / --mono variables there to swap them.
