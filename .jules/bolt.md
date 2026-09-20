# Bolt journal

Critical performance learnings only.

## 2026-09-19 - Render-blocking Google Fonts on standalone HTML
**Learning:** The sneub standalone page loads three Google Font families via a classic blocking `<link rel="stylesheet">`. The CSS response alone references ~24 `@font-face` URLs on mobile, and the app already declares Georgia / system monospace / sans-serif fallbacks — so fonts are enhancement, not required for first paint.
**Action:** Prefer non-blocking font CSS (`media="print" onload="this.media='all'"` + `<noscript>`) before chasing JS micro-opts; measure critical-path network before optimizing `JSON.stringify` on tiny payloads.

## 2026-09-18 - Whole-state persistence was on the typing hot path
**Learning:** Free-text input handlers serialized the entire questionnaire state and wrote it to synchronous `localStorage` on every keystroke. As answers accumulate, that makes typing cost grow with both state size and keystroke count.
**Action:** Keep immediate persistence for navigation and closed-answer changes, but debounce free-text persistence and flush any pending write on page exit.
