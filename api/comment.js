const {
  bodySize,
  createRateLimiter,
  hasOnlyKeys,
  isRecord,
  jsonResponse,
  parseBody
} = require("../server/http.js");

const MAX_BODY_BYTES = 16 * 1024;
const MAX_PREVIOUS = 64;
const MAX_COMMENT_CHARS = 280;
const DEFAULT_TIMEOUT_MS = 8000;
const allowRequest = createRateLimiter({ max: 20, windowMs: 5 * 60 * 1000 });

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
  if (!hasOnlyKeys(payload, ["question", "selected", "previous"])) {
    return { ok: false, error: "invalid_payload" };
  }
  if (!validQuestion(payload.question) || !validSelected(payload.selected)) {
    return { ok: false, error: "invalid_payload" };
  }
  if (!Array.isArray(payload.previous) || payload.previous.length > MAX_PREVIOUS ||
      !payload.previous.every(validPrevious)) {
    return { ok: false, error: "invalid_payload" };
  }
  return { ok: true, value: payload };
}

function providerText(body) {
  const chatContent = body && body.choices && body.choices[0] && body.choices[0].message && body.choices[0].message.content;
  if (typeof chatContent === "string") return chatContent;
  if (body && typeof body.output_text === "string") return body.output_text;
  const parts = [];
  for (const item of body && Array.isArray(body.output) ? body.output : []) {
    for (const part of item && Array.isArray(item.content) ? item.content : []) {
      if (part && part.type === "output_text" && typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("");
}

function parseComment(text) {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return null;
  const fenced = raw.match(/^\`\`\`(?:json)?\\s*([\\s\\S]*?)\\s*\`\`\`$/i);
  const candidates = fenced ? [fenced[1].trim(), raw] : [raw];

  for (const candidate of candidates) {
    let parsed;
    try { parsed = JSON.parse(candidate); } catch (_) { continue; }
    if (!isRecord(parsed) || parsed.kind !== "roast" || typeof parsed.comment !== "string") continue;
    const comment = parsed.comment.trim().replace(/\\s+/g, " ");
    if (!comment || comment.length > MAX_COMMENT_CHARS || /[<>\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/.test(comment)) continue;
    return { comment, kind: "roast" };
  }
  return null;
}

function providerRequest(payload, env, fetchImpl, timeoutMs) {
  const apiKey = env.SNEUB_COMMENT_API_KEY || env.OPENAI_API_KEY;
  const model = env.SNEUB_COMMENT_MODEL;
  if (!apiKey || !model) return Promise.reject(Object.assign(new Error("provider_not_configured"), { code: "not_configured" }));
  const baseUrl = (env.SNEUB_COMMENT_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const messages = [
    {
      role: "system",
      content: [
        "Você é o comentarista do SNEUB, um site deliberadamente ácido sobre autoengano em relacionamentos.",
        "Escreva uma observação curta, específica e em português do Brasil sobre o padrão que aparece nas respostas.",
        "Pode ser áspero: confronte racionalização, medo disfarçado de amor, inércia e desculpas bonitas.",
        "Ataque a desculpa ou a dinâmica, nunca atributos protegidos da pessoa.",
        "Não faça diagnóstico clínico, não invente fatos, não dê certeza que os dados não sustentam, não use HTML, não mencione que é um modelo e não use conselho genérico.",
        "Responda em uma ou duas frases. Retorne SOMENTE JSON válido exatamente com as chaves comment e kind. kind deve ser roast. Não explique seu raciocínio."
      ].join(" ")
    },
    { role: "user", content: JSON.stringify(payload) }
  ];
  const request = Promise.resolve().then(() => fetchImpl(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 256 }),
    signal: controller.signal
  }));
  return request.finally(() => clearTimeout(timer));
}

async function handleComment(req, res, options = {}) {
  if (!req || req.method !== "POST") return jsonResponse(res, 405, { error: "method_not_allowed" });
  const body = req.body;
  if (bodySize(body, MAX_BODY_BYTES) > MAX_BODY_BYTES) return jsonResponse(res, 400, { error: "payload_too_large" });
  if (!allowRequest(req, options.rateLimit)) return jsonResponse(res, 429, { error: "rate_limited" });

  const validation = validatePayload(parseBody(req));
  if (!validation.ok) return jsonResponse(res, 400, { error: validation.error });
  const payload = validation.value;

  if (payload.selected.tone === "r" || payload.previous.some((answer) => answer.tone === "r")) {
    return jsonResponse(res, 200, { comment: SAFETY_COMMENT, kind: "grave" });
  }

  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") return jsonResponse(res, 502, { error: "provider_unavailable" });
  try {
    const upstream = await providerRequest(payload, env, fetchImpl, options.timeoutMs || DEFAULT_TIMEOUT_MS);
    if (!upstream || !upstream.ok) {
      console.warn("[api/comment] provider request failed", {
        status: upstream && Number.isInteger(upstream.status) ? upstream.status : null
      });
      return jsonResponse(res, upstream && upstream.status === 429 ? 429 : 502, { error: "provider_error" });
    }
    const providerOutput = providerText(await upstream.json());
    const output = parseComment(providerOutput);
    if (!output) {
      console.warn("[api/comment] invalid provider response", {
        status: upstream.status || 200,
        hasText: Boolean(providerOutput),
        textLength: typeof providerOutput === "string" ? providerOutput.length : 0
      });
      return jsonResponse(res, 502, { error: "invalid_provider_response" });
    }
    return jsonResponse(res, 200, output);
  } catch (error) {
    console.warn("[api/comment] provider exception", {
      name: error && error.name ? error.name : "Error",
      code: error && error.code ? error.code : null
    });
    return jsonResponse(res, error && error.name === "AbortError" ? 504 : 502, {
      error: error && error.code === "not_configured" ? "provider_unavailable" : "provider_error"
    });
  }
}

function handler(req, res) {
  return handleComment(req, res);
}

function resetRateLimitForTests() {
  allowRequest.reset();
}

module.exports = handler;
module.exports.handleComment = handleComment;
module.exports.validatePayload = validatePayload;
module.exports.resetRateLimitForTests = resetRateLimitForTests;
