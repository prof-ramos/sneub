# Bolt journal

Critical performance learnings only.

## 2026-09-19 - Render-blocking Google Fonts on standalone HTML
**Learning:** The sneub standalone page loads three Google Font families via a classic blocking `<link rel="stylesheet">`. The CSS response alone references ~24 `@font-face` URLs on mobile, and the app already declares Georgia / system monospace / sans-serif fallbacks — so fonts are enhancement, not required for first paint.
**Action:** Prefer non-blocking font CSS (`media="print" onload="this.media='all'"` + `<noscript>`) before chasing JS micro-opts; measure critical-path network before optimizing `JSON.stringify` on tiny payloads.
