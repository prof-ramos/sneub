## 2026-09-18 - Whole-state persistence was on the typing hot path
**Learning:** Free-text input handlers serialized the entire questionnaire state and wrote it to synchronous `localStorage` on every keystroke. As answers accumulate, that makes typing cost grow with both state size and keystroke count.
**Action:** Keep immediate persistence for navigation and closed-answer changes, but debounce free-text persistence and flush any pending write on page exit.
