const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function filesUnder(relativeDir, predicate) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(relativeDir, entry.name);
    return entry.isDirectory() ? filesUnder(relative, predicate) : predicate(relative) ? [relative] : [];
  });
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

const javascript = ["sneub.js", ...["api", "server", "src", "scripts"].flatMap((dir) =>
  filesUnder(dir, (file) => file.endsWith(".js"))
)];
javascript.forEach((file) => run(process.execPath, ["--check", file]));

const tests = ["api", "tests"].flatMap((dir) => filesUnder(dir, (file) => file.endsWith(".test.js")));
run(process.execPath, ["--test", ...tests]);
run(process.execPath, ["scripts/sync-inline.js", "--check"]);
run("git", ["diff", "--check"]);
