const {
  bodySize,
  createRateLimiter,
  jsonResponse,
  parseBody
} = require("../server/http.js");
const {
  SAFETY_COMMENT,
  isGravePayload,
  parseComment,
  validatePayload
} = require("../server/comment-contract.js");
const {
  DEFAULT_TIMEOUT_MS,
  providerRequest,
  providerText
} = require("../server/gemini-comment.js");

const MAX_BODY_BYTES = 16 * 1024;
const allowRequest = createRateLimiter({ max: 20, windowMs: 5 * 60 * 1000 });

async function handleComment(req, res, options = {}) {
  if (!req || req.method !== "POST") return jsonResponse(res, 405, { error: "method_not_allowed" });
  const body = req.body;
  if (bodySize(body, MAX_BODY_BYTES) > MAX_BODY_BYTES) return jsonResponse(res, 400, { error: "payload_too_large" });
  if (!allowRequest(req, options.rateLimit)) return jsonResponse(res, 429, { error: "rate_limited" });

  const validation = validatePayload(parseBody(req));
  if (!validation.ok) return jsonResponse(res, 400, { error: validation.error });
  const payload = validation.value;

  if (isGravePayload(payload)) {
    return jsonResponse(res, 200, { comment: SAFETY_COMMENT, kind: "grave" });
  }

  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") return jsonResponse(res, 502, { error: "provider_unavailable" });
  try {
    const upstream = await providerRequest(payload, env, fetchImpl, options.timeoutMs || DEFAULT_TIMEOUT_MS);
    if (!upstream || !upstream.ok) {
      console.warn("[api/comment] provider request failed", {
        status: upstream && Number.isInteger(upstream.status) ? upstream.status : null
      });
      return jsonResponse(res, upstream && upstream.status === 429 ? 429 : 502, { error: "provider_error" });
    }
    const providerOutput = providerText(await upstream.json());
    const output = parseComment(providerOutput);
    if (!output) {
      console.warn("[api/comment] invalid provider response", {
        status: upstream.status || 200,
        hasText: Boolean(providerOutput),
        textLength: typeof providerOutput === "string" ? providerOutput.length : 0
      });
      return jsonResponse(res, 502, { error: "invalid_provider_response" });
    }
    return jsonResponse(res, 200, output);
  } catch (error) {
    console.warn("[api/comment] provider exception", {
      name: error && error.name ? error.name : "Error",
      code: error && error.code ? error.code : null
    });
    if (error && error.code === "not_configured") {
      return jsonResponse(res, 503, { error: "provider_unavailable" });
    }
    return jsonResponse(res, error && error.name === "AbortError" ? 504 : 502, { error: "provider_error" });
  }
}

function handler(req, res) {
  return handleComment(req, res);
}

function resetRateLimitForTests() {
  allowRequest.reset();
}

module.exports = handler;
module.exports.handleComment = handleComment;
module.exports.validatePayload = validatePayload;
module.exports.resetRateLimitForTests = resetRateLimitForTests;
