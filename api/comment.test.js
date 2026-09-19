const test = require("node:test");
const assert = require("node:assert/strict");
const {
  handleComment,
  resetRateLimitForTests
} = require("./comment.js");

const ENV = {
  SNEUB_COMMENT_API_KEY: "test-key",
  SNEUB_COMMENT_MODEL: "gemini-3.5-flash-lite"
};

function payload(overrides = {}) {
  return {
    question: { id: "paz", chapter: 1, text: "Esta relação te traz mais paz do que dúvidas?" },
    selected: { index: 1, text: "Às vezes.", tone: "y", themes: { paz: "warn" } },
    onScreen: {
      joke: "O “às vezes” carregando um relacionamento inteiro nas costas.",
      more: "Dúvida crônica não é profundidade. É o sistema pedindo uma conversa que você vem adiando."
    },
    previous: [],
    ...overrides
  };
}

function request(body, session = `test-${Math.random()}`) {
  return { method: "POST", body, headers: { "x-sneub-session": session } };
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name] = value; },
    end(value) { this.body = value; }
  };
}

function parsed(res) {
  return JSON.parse(res.body);
}

function geminiBody(commentObj) {
  const text = typeof commentObj === "string" ? commentObj : JSON.stringify(commentObj);
  return {
    candidates: [
      {
        content: {
          parts: [{ text }]
        }
      }
    ]
  };
}

function providerResponse(value, status = 200) {
  return { ok: status >= 200 && status < 300, status, async json() { return value; } };
}

test.beforeEach(() => resetRateLimitForTests());

test("returns a structured Gemini comment and sends schema + closed payload only", async () => {
  let sentUrl;
  let sent;
  let headers;
  const res = response();
  await handleComment(request(payload()), res, {
    env: ENV,
    fetchImpl: async (url, options) => {
      sentUrl = url;
      headers = options.headers;
      sent = JSON.parse(options.body);
      return providerResponse(geminiBody({
        comment: "Você chamou de fase o que já virou padrão.",
        kind: "roast"
      }));
    }
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(parsed(res), {
    comment: "Você chamou de fase o que já virou padrão.",
    kind: "roast"
  });
  assert.match(sentUrl, /\/models\/gemini-3\.5-flash-lite:generateContent$/);
  assert.equal(headers["x-goog-api-key"], "test-key");
  assert.equal(headers.authorization, undefined);
  assert.equal(sent.generationConfig.responseMimeType, "application/json");
  assert.deepEqual(sent.generationConfig.responseSchema.required, ["comment", "kind"]);
  assert.deepEqual(sent.generationConfig.responseSchema.properties.kind.enum, ["roast"]);
  assert.match(sent.system_instruction.parts[0].text, /SNEUB/);
  assert.match(sent.system_instruction.parts[0].text, /onScreen/);
  assert.match(sent.system_instruction.parts[0].text, /ácido|acido/i);
  assert.match(sent.system_instruction.parts[0].text, /ângulo NOVO|angulo NOVO|não parafraseie|nao parafraseie|sem parafrasear/i);
  assert.match(sent.contents[0].parts[0].text, /paz/);
  assert.match(sent.contents[0].parts[0].text, /onScreen/);
  assert.match(sent.contents[0].parts[0].text, /carregando um relacionamento/);
  assert.doesNotMatch(sent.contents[0].parts[0].text, /urgencia|syn|anos|texto livre/);
  assert.equal(Object.prototype.hasOwnProperty.call(sent, "messages"), false);
});

test("accepts schema-contract JSON and rejects empty, oversized, or wrong-kind comments", async () => {
  const ok = response();
  await handleComment(request(payload(), "schema-ok"), ok, {
    env: ENV,
    fetchImpl: async () => providerResponse(geminiBody({
      comment: "Você chamou de exceção o que já virou padrão.",
      kind: "roast"
    }))
  });
  assert.equal(ok.statusCode, 200);

  const empty = response();
  await handleComment(request(payload(), "empty"), empty, {
    env: ENV,
    fetchImpl: async () => providerResponse(geminiBody({ comment: "   ", kind: "roast" }))
  });
  assert.equal(empty.statusCode, 502);

  const oversized = response();
  await handleComment(request(payload(), "oversized"), oversized, {
    env: ENV,
    fetchImpl: async () => providerResponse(geminiBody({
      comment: "x".repeat(281),
      kind: "roast"
    }))
  });
  assert.equal(oversized.statusCode, 502);

  const wrongKind = response();
  await handleComment(request(payload(), "wrong-kind"), wrongKind, {
    env: ENV,
    fetchImpl: async () => providerResponse(geminiBody({
      comment: "Ok.",
      kind: "praise"
    }))
  });
  assert.equal(wrongKind.statusCode, 502);
});

test("rejects invalid payload and free-text fields before calling Gemini", async () => {
  let calls = 0;
  const freeText = response();
  await handleComment(request({ ...payload(), c: { paz: "texto livre privado" } }), freeText, {
    env: ENV,
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(freeText.statusCode, 400);
  assert.equal(calls, 0);

  const missingOnScreen = response();
  const withoutOnScreen = payload();
  delete withoutOnScreen.onScreen;
  await handleComment(request(withoutOnScreen), missingOnScreen, {
    env: ENV,
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(missingOnScreen.statusCode, 400);

  const badSelected = response();
  await handleComment(request({
    ...payload(),
    selected: { index: 1, text: "Às vezes.", tone: "maybe", themes: { paz: "warn" } }
  }, "bad-selected"), badSelected, {
    env: ENV,
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(badSelected.statusCode, 400);
  assert.equal(calls, 0);
});

test("bypasses Gemini when selected or previous tone is grave", async () => {
  let calls = 0;
  const selected = response();
  await handleComment(request(payload({
    selected: { index: 2, text: "Sim.", tone: "r", themes: { seguranca: "bad" } }
  }), "safety-selected"), selected, {
    env: ENV,
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(selected.statusCode, 200);
  assert.equal(parsed(selected).kind, "grave");
  assert.equal(calls, 0);

  const previous = response();
  await handleComment(request(payload({
    previous: [{
      questionId: "seguranca",
      chapter: 1,
      questionText: "Você tem medo?",
      optionIndex: 2,
      optionText: "Sim.",
      tone: "r",
      themes: { seguranca: "bad" }
    }]
  }), "safety-previous"), previous, {
    env: ENV,
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(previous.statusCode, 200);
  assert.equal(parsed(previous).kind, "grave");
  assert.equal(calls, 0);
});

test("maps provider 4xx/429/5xx, unexpected structure, and timeout", async () => {
  const badRequest = response();
  await handleComment(request(payload(), "upstream-400"), badRequest, {
    env: ENV,
    fetchImpl: async () => providerResponse({}, 400)
  });
  assert.equal(badRequest.statusCode, 502);

  const rateLimited = response();
  await handleComment(request(payload(), "upstream-429"), rateLimited, {
    env: ENV,
    fetchImpl: async () => providerResponse({}, 429)
  });
  assert.equal(rateLimited.statusCode, 429);

  const serverError = response();
  await handleComment(request(payload(), "upstream-500"), serverError, {
    env: ENV,
    fetchImpl: async () => providerResponse({}, 500)
  });
  assert.equal(serverError.statusCode, 502);

  const unexpected = response();
  await handleComment(request(payload(), "unexpected"), unexpected, {
    env: ENV,
    fetchImpl: async () => providerResponse({ candidates: [{ content: { parts: [{ text: "not json" }] } }] })
  });
  assert.equal(unexpected.statusCode, 502);

  const noCandidates = response();
  await handleComment(request(payload(), "no-candidates"), noCandidates, {
    env: ENV,
    fetchImpl: async () => providerResponse({ candidates: [] })
  });
  assert.equal(noCandidates.statusCode, 502);

  const timedOut = response();
  await handleComment(request(payload(), "timeout"), timedOut, {
    timeoutMs: 5,
    env: ENV,
    fetchImpl: (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        reject(error);
      });
    })
  });
  assert.equal(timedOut.statusCode, 504);
});

test("returns 503 when API key or model is missing", async () => {
  let calls = 0;
  const missingKey = response();
  await handleComment(request(payload(), "missing-key"), missingKey, {
    env: { SNEUB_COMMENT_MODEL: "gemini-3.5-flash-lite" },
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(missingKey.statusCode, 503);
  assert.equal(parsed(missingKey).error, "provider_unavailable");

  const missingModel = response();
  await handleComment(request(payload(), "missing-model"), missingModel, {
    env: { SNEUB_COMMENT_API_KEY: "test-key" },
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(missingModel.statusCode, 503);
  assert.equal(calls, 0);
});

test("does not fall back to OPENAI_API_KEY", async () => {
  let calls = 0;
  const res = response();
  await handleComment(request(payload(), "openai-fallback"), res, {
    env: { OPENAI_API_KEY: "openai-key", SNEUB_COMMENT_MODEL: "gemini-3.5-flash-lite" },
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(res.statusCode, 503);
  assert.equal(calls, 0);
});

test("maps local rate limits to 429", async () => {
  const first = response();
  const options = {
    rateLimit: { max: 1, windowMs: 60_000 },
    env: ENV,
    fetchImpl: async () => providerResponse(geminiBody({ comment: "Ok.", kind: "roast" }))
  };
  await handleComment(request(payload(), "limited"), first, options);
  assert.equal(first.statusCode, 200);
  const second = response();
  await handleComment(request(payload(), "limited"), second, options);
  assert.equal(second.statusCode, 429);
});

test("rejects non-POST methods", async () => {
  const res = response();
  await handleComment({ method: "GET", headers: {} }, res, { env: ENV });
  assert.equal(res.statusCode, 405);
});
