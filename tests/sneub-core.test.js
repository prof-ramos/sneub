const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../src/sneub-core.js");

const QUESTIONS = [
  {
    ch: 1,
    id: "paz",
    q: "Esta relação te traz paz?",
    opts: [
      { t: "Sim.", tone: "g", themes: { paz: "good" } },
      { t: "Às vezes.", tone: "y", themes: { paz: "warn" } },
      { t: "Não.", tone: "y", themes: { paz: "bad" } }
    ]
  },
  {
    ch: 1,
    id: "sozinho",
    q: "Você escolhe ou teme ficar só?",
    opts: [
      { t: "Escolho.", tone: "g", themes: { escolha: "good" } },
      { t: "Os dois.", tone: "y", themes: { escolha: "warn", apego: "warn" } }
    ]
  },
  {
    ch: 5,
    id: "seguranca",
    q: "Existe violência?",
    allowCustom: false,
    opts: [
      { t: "Não.", tone: "g", themes: { seguranca: "good" } },
      { t: "Sim.", tone: "r", themes: { seguranca: "bad" } }
    ]
  }
];

function analysis(state = "warn", confidence = 0.9) {
  return {
    analysis: {
      paz: {
        state,
        confidence,
        probabilities: { good: 0.02, warn: 0.9, bad: 0.03, unclear: 0.05 }
      }
    }
  };
}

test("normalizes legacy and malformed persisted states", () => {
  assert.deepEqual(core.normalizeState({ i: "2", a: { paz: 1 }, w: {}, syn: {}, anos: "sim" }), {
    i: 2,
    a: { paz: 1 },
    c: {},
    w: {},
    syn: {},
    anos: "sim"
  });
  assert.deepEqual(core.normalizeState({ i: -1, a: [], c: "bad", w: null, syn: [], anos: 2 }), core.createEmptyState());
});

test("detects safety only from a valid closed safety option", () => {
  assert.equal(core.safetyLocked(QUESTIONS, { a: { seguranca: 1 } }), true);
  assert.equal(core.safetyLocked(QUESTIONS, { a: { seguranca: core.CUSTOM_ANSWER } }), false);
  assert.equal(core.safetyModeAt(QUESTIONS, { a: { seguranca: 1 } }, 1), false);
  assert.equal(core.safetyModeAt(QUESTIONS, { a: { seguranca: 1 } }, 2), true);
});

test("comment payload omits prior custom answers", () => {
  const payload = core.commentPayload(QUESTIONS, {
    a: { paz: core.CUSTOM_ANSWER, sozinho: 1 },
    c: { paz: "texto livre privado" }
  }, QUESTIONS[1], 1);
  assert.equal(payload.selected.text, "Os dois.");
  assert.equal(payload.onScreen.joke, QUESTIONS[1].opts[1].joke);
  assert.deepEqual(payload.previous, []);
  assert.doesNotMatch(JSON.stringify(payload), /texto livre privado/);
});

test("scores closed answers and merges custom signals by known question themes", () => {
  const state = {
    a: { paz: core.CUSTOM_ANSWER, sozinho: 1 },
    c: { paz: "Quase nunca sinto paz." }
  };
  const rows = core.patterns(QUESTIONS, state, {
    paz: { state: "bad", confidence: 0.95, probabilities: {} }
  });
  assert.deepEqual(rows, [
    { k: "paz", good: 0, warn: 0, bad: 1, n: 1, heat: 2 },
    { k: "escolha", good: 0, warn: 1, bad: 0, n: 1, heat: 1 },
    { k: "apego", good: 0, warn: 1, bad: 0, n: 1, heat: 1 }
  ]);

  const ignored = core.patterns(QUESTIONS, state, { paz: { state: "unclear" } });
  assert.equal(ignored.some((row) => row.k === "paz"), false);
});

test("summarizes positive, mixed, concerning and empty signal sets without hiding good answers", () => {
  assert.deepEqual(core.summarizePatterns([{ good: 4, warn: 1, bad: 0 }]), {
    good: 4,
    warn: 1,
    bad: 0,
    signals: 5,
    concern: 1,
    balance: 3,
    status: "favorable"
  });
  assert.equal(core.summarizePatterns([{ good: 4, warn: 2, bad: 1 }]).status, "mixed");
  assert.equal(core.summarizePatterns([{ good: 2, warn: 1, bad: 1 }]).status, "attention");
  assert.equal(core.summarizePatterns([]).status, "unclear");
});

test("collects only active, valid and allowed custom answers", () => {
  const answers = core.collectCustomAnswers(QUESTIONS, {
    a: { paz: core.CUSTOM_ANSWER, sozinho: 0, seguranca: core.CUSTOM_ANSWER },
    c: { paz: "  Tenho paz só às vezes.  ", seguranca: "não deve sair" }
  });
  assert.deepEqual(answers, [{
    id: "paz",
    chapter: 1,
    question: "Esta relação te traz paz?",
    text: "Tenho paz só às vezes.",
    themes: ["paz"]
  }]);
});

test("validates the complete normalized analysis contract", () => {
  const answers = [{ id: "paz" }];
  assert.deepEqual(core.validCustomAnalysis(analysis(), answers), analysis().analysis);
  assert.equal(core.validCustomAnalysis({ ...analysis(), extra: true }, answers), null);
  assert.equal(core.validCustomAnalysis(analysis("maybe"), answers), null);
  assert.equal(core.validCustomAnalysis(analysis("warn", 2), answers), null);
  assert.equal(core.validCustomAnalysis({ analysis: {} }, answers), null);
});
