const test = require("node:test");
const assert = require("node:assert/strict");
const {
  handleComment,
  resetRateLimitForTests
} = require("./comment.js");

function payload(overrides = {}) {
  return {
    question: { id: "paz", chapter: 1, text: "Esta relação te traz mais paz do que dúvidas?" },
    selected: { index: 1, text: "Às vezes.", tone: "y", themes: { paz: "warn" } },
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

function providerResponse(value, status = 200) {
  return { ok: status >= 200 && status < 300, status, async json() { return value; } };
}

test.beforeEach(() => resetRateLimitForTests());

test("returns a structured model comment without sending free-text fields", async () => {
  let sent;
  const res = response();
  await handleComment(request(payload()), res, {
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async (_url, options) => {
      sent = JSON.parse(options.body);
      return providerResponse({ output_text: JSON.stringify({ comment: "Você chamou de fase o que já virou padrão.", kind: "roast" }) });
    }
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(parsed(res), { comment: "Você chamou de fase o que já virou padrão.", kind: "roast" });
  assert.equal(sent.messages.length, 2);
  assert.match(sent.messages[1].content, /paz/);
  assert.doesNotMatch(sent.messages[1].content, /urgencia|syn|anos/);
});

test("rejects custom-answer content before calling the comment provider", async () => {
  let calls = 0;
  const res = response();
  await handleComment(request({ ...payload(), c: { paz: "texto livre privado" } }), res, {
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(res.statusCode, 400);
  assert.equal(calls, 0);
});

test("bypasses the provider when safety is present", async () => {
  let calls = 0;
  const res = response();
  await handleComment(request(payload({ selected: { index: 2, text: "Sim.", tone: "r", themes: { seguranca: "bad" } } })), res, {
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async () => { calls += 1; return providerResponse({}); }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(parsed(res).kind, "grave");
  assert.equal(calls, 0);
});

test("maps provider failures and timeouts to fallback-safe errors", async () => {
  const failed = response();
  await handleComment(request(payload(), "failed"), failed, {
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async () => providerResponse({}, 500)
  });
  assert.equal(failed.statusCode, 502);

  const timedOut = response();
  await handleComment(request(payload(), "timeout"), timedOut, {
    timeoutMs: 5,
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
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

test("maps malformed model output and rate limits", async () => {
  const malformed = response();
  await handleComment(request(payload(), "malformed"), malformed, {
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async () => providerResponse({ output_text: "not json" })
  });
  assert.equal(malformed.statusCode, 502);

  const first = response();
  const options = {
    rateLimit: { max: 1, windowMs: 60_000 },
    env: { OPENAI_API_KEY: "test-key", SNEUB_COMMENT_MODEL: "test-model" },
    fetchImpl: async () => providerResponse({ output_text: JSON.stringify({ comment: "Ok.", kind: "roast" }) })
  };
  await handleComment(request(payload(), "limited"), first, options);
  const second = response();
  await handleComment(request(payload(), "limited"), second, options);
  assert.equal(second.statusCode, 429);
});
