function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value, keys) {
  return isRecord(value) && Object.keys(value).every((key) => keys.includes(key));
}

function bodySize(body, maxBytes) {
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  try { return Buffer.byteLength(JSON.stringify(body || {}), "utf8"); } catch (_) { return maxBytes + 1; }
}

function parseBody(req) {
  const body = req && req.body;
  if (isRecord(body)) return body;
  if (typeof body !== "string" || !body.trim()) return null;
  try { return JSON.parse(body); } catch (_) { return null; }
}

function clientIdentity(req) {
  const headers = req && req.headers;
  const session = headers && (headers["x-sneub-session"] || headers["X-Sneub-Session"]);
  if (session && typeof session === "string" && session.length <= 100) return `session:${session}`;
  const forwarded = headers && (headers["x-forwarded-for"] || headers["X-Forwarded-For"]);
  if (forwarded && typeof forwarded === "string") return `ip:${forwarded.split(",")[0].trim()}`;
  return `ip:${req && req.socket && req.socket.remoteAddress || "anonymous"}`;
}

function createRateLimiter(defaults) {
  const buckets = new Map();
  function allowRequest(req, overrides = {}) {
    const now = Date.now();
    const max = overrides.max || defaults.max;
    const windowMs = overrides.windowMs || defaults.windowMs;
    const key = clientIdentity(req);
    const bucket = buckets.get(key);
    if (!bucket || now - bucket.startedAt >= windowMs) {
      buckets.set(key, { startedAt: now, count: 1 });
      return true;
    }
    if (bucket.count >= max) return false;
    bucket.count += 1;
    return true;
  }
  allowRequest.reset = () => buckets.clear();
  return allowRequest;
}

function jsonResponse(res, status, value) {
  if (res && typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(value);
  }
  res.statusCode = status;
  if (typeof res.setHeader === "function") res.setHeader("content-type", "application/json; charset=utf-8");
  if (typeof res.end === "function") res.end(JSON.stringify(value));
  return undefined;
}

module.exports = {
  bodySize,
  createRateLimiter,
  hasOnlyKeys,
  isRecord,
  jsonResponse,
  parseBody
};
