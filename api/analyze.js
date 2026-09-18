const {
  bodySize,
  createRateLimiter,
  jsonResponse,
  parseBody
} = require("../server/http.js");
const {
  configuredThreshold,
  normalizeProviderResponse,
  validatePayload
} = require("../server/analysis-contract.js");
const { providerRequest } = require("../server/jev.js");

const MAX_BODY_BYTES = 32 * 1024;
const DEFAULT_TIMEOUT_MS = 5000;
const allowRequest = createRateLimiter({ max: 10, windowMs: 5 * 60 * 1000 });

async function handleAnalyze(req, res, options = {}) {
  if (!req || req.method !== "POST") return jsonResponse(res, 405, { error: "method_not_allowed" });
  if (bodySize(req.body, MAX_BODY_BYTES) > MAX_BODY_BYTES) {
    return jsonResponse(res, 400, { error: "payload_too_large" });
  }
  if (!allowRequest(req, options.rateLimit)) return jsonResponse(res, 429, { error: "rate_limited" });

  const validation = validatePayload(parseBody(req));
  if (!validation.ok) return jsonResponse(res, 400, { error: validation.error });
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") return jsonResponse(res, 503, { error: "provider_unavailable" });

  let threshold;
  try {
    threshold = configuredThreshold(env);
  } catch (_) {
    return jsonResponse(res, 503, { error: "provider_unavailable" });
  }

  try {
    const upstream = await providerRequest(
      validation.value,
      env,
      fetchImpl,
      options.timeoutMs || DEFAULT_TIMEOUT_MS
    );
    if (!upstream || !upstream.ok) {
      return jsonResponse(res, upstream && upstream.status === 429 ? 429 : 502, { error: "provider_error" });
    }
    const output = normalizeProviderResponse(await upstream.json(), validation.value.answers, threshold);
    if (!output) return jsonResponse(res, 502, { error: "invalid_provider_response" });
    return jsonResponse(res, 200, output);
  } catch (error) {
    if (error && error.code === "not_configured") {
      return jsonResponse(res, 503, { error: "provider_unavailable" });
    }
    return jsonResponse(res, error && error.name === "AbortError" ? 504 : 502, { error: "provider_error" });
  }
}

function handler(req, res) {
  return handleAnalyze(req, res);
}

function resetRateLimitForTests() {
  allowRequest.reset();
}

module.exports = handler;
module.exports.handleAnalyze = handleAnalyze;
module.exports.normalizeProviderResponse = normalizeProviderResponse;
module.exports.validatePayload = validatePayload;
module.exports.resetRateLimitForTests = resetRateLimitForTests;
