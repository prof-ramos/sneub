const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "sneub.js"), "utf8");
const html = fs.readFileSync(path.join(root, "seu-namoro-e-uma-bosta.html"), "utf8");

test("question progress and heading semantics stay unambiguous", () => {
  assert.doesNotMatch(app, /id="question"/);
  assert.doesNotMatch(app, /<div class="count"><b>\$\{n\}<\/b> \/ \$\{total\}<\/div>/);
  ["q-title", "writes-title", "gate-title", "out-title"].forEach((id) => {
    assert.match(app, new RegExp(`id="${id}"`));
  });
  assert.match(app, /<h1 class="res" id="out-title"/);
});

test("custom answers retain explicit validation and one roving tab stop", () => {
  assert.match(app, /aria-describedby="custom-answer-help custom-error custom-count"/);
  assert.match(app, /aria-invalid/);
  assert.match(app, /next\.disabled = !valid/);
  assert.match(app, /button\.tabIndex = index === tabbable \? 0 : -1/);
  assert.match(html, /\.nav\.custom-sticky #next/);
  assert.match(html, /bottom: calc\(12px \+ var\(--safe-b\)\)/);
  assert.match(html, /\.custom-meta[\s\S]*font-size: 13px/);
});

test("screen routes do not collide with section IDs", () => {
  ["home", "writes", "gate", "result"].forEach((screen) => {
    assert.match(app, new RegExp(`#screen=${screen}`));
  });
  assert.doesNotMatch(app, /show\("(?:home|writes|gate|out)", "#(?:home|writes|gate|result)"/);
  assert.match(app, /window\.addEventListener\("popstate"/);
});

test("safety output is a dedicated non-roast flow", () => {
  const start = app.indexOf("function renderSafetyOut");
  const end = app.indexOf("function renderOut", start);
  const safetyOutput = app.slice(start, end);
  assert.ok(start >= 0 && end > start);
  assert.match(safetyOutput, /safetySupportActions\(\)/);
  assert.match(app, /Ligar para o 180/);
  assert.match(app, /Ligar para o 188/);
  assert.doesNotMatch(safetyOutput, /roastcard|id="copy"|class="card"/);
  assert.match(app, /if \(safetyLocked\(\)\) return renderSafetyOut/);
});

test("home privacy and progressive notebook remain visible in source", () => {
  assert.match(app, /Alternativas podem gerar comentários por IA/);
  assert.match(app, /Ver o resultado agora/);
  assert.match(app, /WRITES\.slice\(0, 3\)/);
  assert.match(app, /<summary>Quero aprofundar<\/summary>/);
});

test("AI comment appends under the local reaction without replacing it", () => {
  assert.match(app, /function renderAgentComment\(comment\)/);
  assert.match(app, /dataset\.aiComment = "true"/);
  assert.match(app, /querySelector\("\[data-ai-comment\]"\)/);
  assert.match(app, /ai\.textContent = comment;/);
  assert.doesNotMatch(app, /Comentário da IA:/);
  assert.match(app, /renderLocalReaction\(option, safety\);\s*\n\s*renderAgentComment\(commentCache\.get\(cacheKey\)\)/);
  assert.match(app, /\/\/ Show the local joke immediately/);
  assert.match(app, /if \(commentIsCurrent\(item, idx, requestId\)\) renderAgentComment\(comment\)/);
  assert.match(app, /cancelCommentRequest\(\)/);
});


test("free-text persistence coalesces synchronous localStorage writes", () => {
  assert.match(app, /let saveTimer = null/);
  assert.match(app, /function scheduleSave\(\)[\s\S]*setTimeout\([\s\S]*200\)/);
  assert.match(app, /state\.c\[item\.id\] = textarea\.value;\s*scheduleSave\(\)/);
  assert.match(app, /state\.w\[write\.id\] = ta\.value; scheduleSave\(\)/);
  assert.match(app, /state\.syn\[synthesis\.id\] = inp\.value; scheduleSave\(\)/);
  assert.match(app, /state\.anos = e\.target\.value; scheduleSave\(\)/);
  assert.match(app, /window\.addEventListener\("pagehide"[\s\S]*if \(saveTimer\) save\(\)/);
});
