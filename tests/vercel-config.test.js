const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Vercel serves the standalone application at the root URL", () => {
  const root = path.resolve(__dirname, "..");
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.deepEqual(config.rewrites, [{
    source: "/",
    destination: "/seu-namoro-e-uma-bosta.html"
  }]);
  assert.equal(fs.existsSync(path.join(root, config.rewrites[0].destination.slice(1))), true);
});
