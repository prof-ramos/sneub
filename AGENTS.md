# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free browser experience. Root files:

- `sneub.js`: source data and application logic for the questionnaire, scoring, persistence, and result rendering.
- `seu-namoro-e-uma-bosta.html`: self-contained production page with markup, inline CSS, fonts, and an inline copy of the JavaScript.

There are no separate source, asset, or test directories. Answers stay in browser `localStorage`; there is no server or database.

Update `sneub.js` and mirror it in the HTML `<script>` block; the page does not load the external file.

## Editorial Voice & Product Intent

The site's toxicity is deliberate. Its job is to interrupt rationalization, expose self-deception, and say the uncomfortable thing people avoid saying about a relationship. Do not dilute questions, jokes, labels, or results into wellness clichés or polite corporate language. Preserve profanity, dark humor, blunt conclusions, and punchy sentences. If answers indicate settling, carrying a partner, confusing fear with love, or dating potential instead of a real person, name that plainly.

Blunt is not the same as careless. Do not turn a pattern into a diagnosis or claim facts the answers cannot support. When fear, threat, control, isolation, coercion, or violence appears, drop the roast and prioritize the safety message and `180`/`188` resources. That is not softening the site; it is recognizing that the truth has changed.

## Build, Test, and Development Commands

No build or package-install step is required.

```sh
node --check sneub.js
open "seu-namoro-e-uma-bosta.html"
```

The first checks JavaScript syntax; the second opens the standalone page on macOS. Use a static server only if direct file loading causes browser restrictions.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, and UTF-8. Use `camelCase` for functions/state, uppercase names for immutable collections (`Q`, `WRITES`, `LABELS`), and lowercase keys. Preserve the Portuguese voice and accessibility patterns.

## Testing Guidelines

There is no automated framework or coverage requirement. Run `node --check sneub.js`, then manually verify all questionnaire paths, persistence, restart/back controls, sharing, responsive layout, safety messaging, and the browser console.

## Commit & Pull Request Guidelines

This checkout has no Git history or PR configuration. If Git is added, use short imperative subjects (for example, `Improve questionnaire keyboard flow`) and document user-visible changes, checks, and screenshots.

## Security & Privacy

Do not add analytics, network submission, or answer logging without approval. Treat `localStorage` as private data; never commit exported answers or browser artifacts.
