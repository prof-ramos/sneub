const { hasOnlyKeys, isRecord } = require("./http.js");

const MAX_PREVIOUS = 64;
const MAX_COMMENT_CHARS = 280;
const SAFETY_COMMENT = "Sem piada agora. O que você marcou pode ser sério. Isso merece apoio real, não um roast.";
const TONES = new Set(["g", "y", "r"]);
const THEME_STATES = new Set(["good", "warn", "bad"]);

function validShortText(value, max) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function validThemes(value) {
  if (!isRecord(value) || Object.keys(value).length > 16) return false;
  return Object.entries(value).every(([key, state]) =>
    /^[a-z][a-z0-9_]{0,40}$/.test(key) && THEME_STATES.has(state)
  );
}

function validQuestion(value) {
  return hasOnlyKeys(value, ["id", "chapter", "text"]) &&
    /^[a-z][a-z0-9_]{0,40}$/.test(value.id || "") &&
    Number.isInteger(value.chapter) && value.chapter >= 1 && value.chapter <= 10 &&
    validShortText(value.text, 500);
}

function validSelected(value) {
  return hasOnlyKeys(value, ["index", "text", "tone", "themes"]) &&
    Number.isInteger(value.index) && value.index >= 0 && value.index <= 20 &&
    validShortText(value.text, 500) && TONES.has(value.tone) && validThemes(value.themes);
}

function validOnScreen(value) {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (!keys.includes("joke") || keys.some((key) => key !== "joke" && key !== "more")) return false;
  if (!validShortText(value.joke, 500)) return false;
  if ("more" in value && !validShortText(value.more, 500)) return false;
  return true;
}

function validPrevious(value) {
  return hasOnlyKeys(value, [
    "questionId", "chapter", "questionText", "optionIndex", "optionText", "tone", "themes"
  ]) &&
    /^[a-z][a-z0-9_]{0,40}$/.test(value.questionId || "") &&
    Number.isInteger(value.chapter) && value.chapter >= 1 && value.chapter <= 10 &&
    Number.isInteger(value.optionIndex) && value.optionIndex >= 0 && value.optionIndex <= 20 &&
    validShortText(value.questionText, 500) && validShortText(value.optionText, 500) &&
    TONES.has(value.tone) && validThemes(value.themes);
}

function validatePayload(payload) {
  if (!hasOnlyKeys(payload, ["question", "selected", "onScreen", "previous"])) {
    return { ok: false, error: "invalid_payload" };
  }
  if (!validQuestion(payload.question) || !validSelected(payload.selected) || !validOnScreen(payload.onScreen)) {
    return { ok: false, error: "invalid_payload" };
  }
  if (!Array.isArray(payload.previous) || payload.previous.length > MAX_PREVIOUS ||
      !payload.previous.every(validPrevious)) {
    return { ok: false, error: "invalid_payload" };
  }
  return { ok: true, value: payload };
}

function parseComment(text) {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return null;
  const fenced = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidates = fenced ? [fenced[1].trim(), raw] : [raw];

  for (const candidate of candidates) {
    let parsed;
    try { parsed = JSON.parse(candidate); } catch (_) { continue; }
    if (!isRecord(parsed) || !hasOnlyKeys(parsed, ["comment", "kind"]) ||
        parsed.kind !== "roast" || typeof parsed.comment !== "string") continue;
    const comment = parsed.comment.trim().replace(/\s+/g, " ");
    if (!comment || comment.length > MAX_COMMENT_CHARS || /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(comment)) continue;
    return { comment, kind: "roast" };
  }
  return null;
}

function isGravePayload(payload) {
  return payload.selected.tone === "r" || payload.previous.some((answer) => answer.tone === "r");
}

module.exports = {
  MAX_COMMENT_CHARS,
  MAX_PREVIOUS,
  SAFETY_COMMENT,
  isGravePayload,
  parseComment,
  validatePayload
};
