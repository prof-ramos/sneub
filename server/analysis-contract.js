const { hasOnlyKeys, isRecord } = require("./http.js");

const MAX_TEXT_CHARS = 500;
const CLASSIFICATIONS = ["good", "warn", "bad", "unclear"];
const CLASSIFICATION_SET = new Set(CLASSIFICATIONS);

const QUESTION_META = {
  paz: { chapter: 1, themes: ["paz"] },
  admira: { chapter: 1, themes: ["admiracao", "potencial"] },
  amigo: { chapter: 1, themes: ["escolha"] },
  hoje: { chapter: 1, themes: ["escolha"] },
  sozinho: { chapter: 1, themes: ["escolha", "apego"] },
  potencial: { chapter: 1, themes: ["potencial"] },
  afeto: { chapter: 1, themes: ["afeto"] },
  carregar: { chapter: 2, themes: ["reciprocidade"] },
  curiosidade: { chapter: 2, themes: ["reciprocidade"] },
  atencao: { chapter: 2, themes: ["comunicacao"] },
  conquistas: { chapter: 2, themes: ["reciprocidade"] },
  sonhos: { chapter: 2, themes: ["identidade"] },
  explicar: { chapter: 2, themes: ["comunicacao"] },
  decifrar: { chapter: 2, themes: ["comunicacao"] },
  facil: { chapter: 3, themes: ["impacto"] },
  saudade: { chapter: 3, themes: ["apego"] },
  alivio: { chapter: 3, themes: ["alivio"] },
  corpo: { chapter: 3, themes: ["nervoso"] },
  dinheiro: { chapter: 3, themes: ["dinheiro"] },
  provar: { chapter: 3, themes: ["valor"] },
  gostos: { chapter: 4, themes: ["identidade"] },
  investigar: { chapter: 4, themes: ["identidade"] },
  familia: { chapter: 4, themes: ["identidade"] },
  decidir: { chapter: 4, themes: ["limites"] },
  emergencia: { chapter: 5, themes: ["confianca"] },
  confiar: { chapter: 5, themes: ["confianca"] },
  intimidade: { chapter: 5, themes: ["confianca"] },
  seamar: { chapter: 5, themes: ["limites"] }
};

function validText(value, max = MAX_TEXT_CHARS) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function sameStrings(left, right) {
  if (!Array.isArray(left) || left.length !== right.length || !left.every((value) => typeof value === "string")) {
    return false;
  }
  const expected = [...right].sort();
  return [...left].sort().every((value, index) => value === expected[index]);
}

function validAnswer(answer) {
  if (!hasOnlyKeys(answer, ["id", "chapter", "question", "text", "themes"])) return false;
  const meta = QUESTION_META[answer.id];
  return Boolean(meta) && answer.chapter === meta.chapter &&
    validText(answer.question) && validText(answer.text) && sameStrings(answer.themes, meta.themes);
}

function validatePayload(payload) {
  const maxAnswers = Object.keys(QUESTION_META).length;
  if (!hasOnlyKeys(payload, ["answers"]) || !Array.isArray(payload.answers) ||
      payload.answers.length < 1 || payload.answers.length > maxAnswers ||
      !payload.answers.every(validAnswer)) {
    return { ok: false, error: "invalid_payload" };
  }
  const ids = payload.answers.map((answer) => answer.id);
  if (new Set(ids).size !== ids.length) return { ok: false, error: "invalid_payload" };
  return { ok: true, value: payload };
}

function configuredThreshold(env) {
  const raw = env.SNEUB_JEV_MIN_CONFIDENCE;
  if (raw == null || String(raw).trim() === "") return null;
  const threshold = Number(raw);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw Object.assign(new Error("invalid_threshold"), { code: "invalid_configuration" });
  }
  return threshold;
}

function validProbabilities(value) {
  if (!isRecord(value) || Object.keys(value).sort().join(",") !== "bad,good,unclear,warn") return false;
  const probabilities = CLASSIFICATIONS.map((key) => value[key]);
  return probabilities.every((number) => Number.isFinite(number) && number >= 0 && number <= 1) &&
    Math.abs(probabilities.reduce((sum, number) => sum + number, 0) - 1) <= 0.001;
}

function normalizeProviderResponse(body, sentAnswers, threshold) {
  if (!isRecord(body) || !isRecord(body.answers)) return null;
  const expectedIds = sentAnswers.map((answer) => answer.id).sort();
  if (Object.keys(body.answers).sort().join(",") !== expectedIds.join(",")) return null;
  const analysis = {};
  for (const id of expectedIds) {
    const answer = body.answers[id];
    if (!hasOnlyKeys(answer, ["type", "choice", "probabilities", "confidence"]) ||
        answer.type !== "choice" || !CLASSIFICATION_SET.has(answer.choice) ||
        !Number.isFinite(answer.confidence) || answer.confidence < 0 || answer.confidence > 1 ||
        !validProbabilities(answer.probabilities)) return null;
    const state = answer.choice !== "unclear" && (threshold == null || answer.confidence < threshold)
      ? "unclear"
      : answer.choice;
    analysis[id] = {
      state,
      confidence: answer.confidence,
      probabilities: Object.fromEntries(CLASSIFICATIONS.map((key) => [key, answer.probabilities[key]]))
    };
  }
  return { analysis };
}

module.exports = {
  CLASSIFICATIONS,
  MAX_TEXT_CHARS,
  QUESTION_META,
  configuredThreshold,
  normalizeProviderResponse,
  validatePayload,
  validProbabilities,
  validText
};
