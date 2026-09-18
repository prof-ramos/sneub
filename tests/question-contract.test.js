const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { QUESTION_META } = require("../server/analysis-contract.js");

function questionnaire() {
  const source = fs.readFileSync(path.resolve(__dirname, "..", "sneub.js"), "utf8");
  const catalog = source.split("const WRITES =")[0];
  const context = {};
  vm.runInNewContext(`${catalog}\nthis.__questions = Q;`, context);
  return context.__questions;
}

test("backend custom-answer allowlist matches the canonical questionnaire", () => {
  const expected = Object.fromEntries(questionnaire()
    .filter((question) => question.allowCustom !== false)
    .map((question) => [question.id, {
      chapter: question.ch,
      themes: [...new Set(question.opts.flatMap((option) => Object.keys(option.themes || {})))]
    }]));
  assert.deepEqual(QUESTION_META, expected);
  assert.equal(Object.hasOwn(QUESTION_META, "seguranca"), false);
});
