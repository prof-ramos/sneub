const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const analyze = require("../api/analyze.js");
const comment = require("../api/comment.js");

const root = path.resolve(__dirname, "..");
const host = process.env.SNEUB_HOST || "127.0.0.1";
const port = Number(process.env.SNEUB_PORT) || 4173;
const MAX_REQUEST_BYTES = 64 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_REQUEST_BYTES) {
        reject(Object.assign(new Error("payload_too_large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendFile(res, relativePath, contentType) {
  res.statusCode = 200;
  res.setHeader("content-type", contentType);
  res.end(fs.readFileSync(path.join(root, relativePath)));
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`);
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/seu-namoro-e-uma-bosta.html")) {
    sendFile(res, "seu-namoro-e-uma-bosta.html", "text/html; charset=utf-8");
    return;
  }
  if (req.method === "GET" && url.pathname === "/favicon.ico") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (url.pathname === "/api/comment" || url.pathname === "/api/analyze") {
    try {
      req.body = await readBody(req);
      await (url.pathname === "/api/comment" ? comment : analyze)(req, res);
    } catch (error) {
      if (!res.headersSent) {
        res.statusCode = error && error.statusCode || 500;
        res.setHeader("content-type", "application/json; charset=utf-8");
      }
      if (!res.writableEnded) res.end(JSON.stringify({ error: "request_failed" }));
    }
    return;
  }
  res.statusCode = 404;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end("Not found");
}

const server = http.createServer((req, res) => {
  route(req, res).catch(() => {
    if (!res.headersSent) res.statusCode = 500;
    if (!res.writableEnded) res.end("Internal server error");
  });
});

server.listen(port, host, () => {
  process.stdout.write(`SNEUB local: http://${host}:${port}\n`);
});
