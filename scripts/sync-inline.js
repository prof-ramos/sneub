const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "sneub.js");
const htmlPath = path.join(root, "seu-namoro-e-uma-bosta.html");
const source = fs.readFileSync(sourcePath, "utf8").trimEnd();
const html = fs.readFileSync(htmlPath, "utf8");
const openMarker = "  <script>";
const closeMarker = "</script>";
const open = html.lastIndexOf(openMarker);
const close = html.lastIndexOf(closeMarker);

if (open < 0 || close < 0 || close <= open) {
  throw new Error("Não encontrei o bloco <script> standalone.");
}
if (source.includes(closeMarker)) {
  throw new Error("sneub.js contém </script> e não pode ser incorporado com segurança.");
}

const synced = `${html.slice(0, open)}${openMarker}\n${source}\n  ${closeMarker}${html.slice(close + closeMarker.length)}`;

if (process.argv.includes("--check")) {
  if (synced !== html) {
    process.stderr.write("O JavaScript inline está fora de sincronia. Execute node scripts/sync-inline.js.\n");
    process.exitCode = 1;
  }
} else if (synced !== html) {
  fs.writeFileSync(htmlPath, synced, "utf8");
  process.stdout.write("JavaScript standalone sincronizado.\n");
}
