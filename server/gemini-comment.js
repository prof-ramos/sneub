const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_TIMEOUT_MS = 8000;

const SYSTEM_INSTRUCTION = [
  "Você é o comentarista do SNEUB, um site deliberadamente ácido sobre autoengano em relacionamentos.",
  "O campo onScreen.joke (e onScreen.more, se existir) já está na tela do usuário: é a voz do site.",
  "Escreva UMA observação curta em português do Brasil que continue essa voz com um ângulo NOVO — não parafraseie, não repita e não compete com onScreen.",
  "Pode ser áspero: confronte racionalização, medo disfarçado de amor, inércia e desculpas bonitas.",
  "Ataque a desculpa ou a dinâmica, nunca atributos protegidos da pessoa.",
  "Não faça diagnóstico clínico, não invente fatos, não dê certeza que os dados não sustentam, não use HTML, não mencione IA/modelo, não rotule o texto e não use conselho genérico.",
  "Responda em uma ou duas frases. Retorne SOMENTE JSON válido exatamente com as chaves comment e kind. kind deve ser roast. Não explique seu raciocínio."
].join(" ");

const COMMENT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    comment: { type: "string", description: "1-2 frases em pt-BR" },
    kind: { type: "string", enum: ["roast"] }
  },
  required: ["comment", "kind"]
};

function providerPayload(payload) {
  return {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(payload) }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: COMMENT_RESPONSE_SCHEMA,
      maxOutputTokens: 256
    }
  };
}

function providerText(body) {
  const parts = body &&
    body.candidates &&
    body.candidates[0] &&
    body.candidates[0].content &&
    Array.isArray(body.candidates[0].content.parts)
      ? body.candidates[0].content.parts
      : [];
  const texts = [];
  for (const part of parts) {
    if (part && typeof part.text === "string") texts.push(part.text);
  }
  return texts.join("");
}

function providerRequest(payload, env, fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const apiKey = env.SNEUB_COMMENT_API_KEY;
  const model = env.SNEUB_COMMENT_MODEL;
  if (!apiKey || !model) {
    return Promise.reject(Object.assign(new Error("provider_not_configured"), { code: "not_configured" }));
  }
  const baseUrl = (env.SNEUB_COMMENT_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return Promise.resolve().then(() => fetchImpl(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(providerPayload(payload)),
    signal: controller.signal
  })).finally(() => clearTimeout(timer));
}

module.exports = {
  COMMENT_RESPONSE_SCHEMA,
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT_MS,
  SYSTEM_INSTRUCTION,
  providerPayload,
  providerRequest,
  providerText
};
