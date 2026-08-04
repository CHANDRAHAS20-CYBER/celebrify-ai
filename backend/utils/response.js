/* ==========================================================================
   utils/response.js — tiny helpers for consistent JSON responses.
   ========================================================================== */

function ok(res, data) {
  return res.json(data);
}

function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

module.exports = { ok, fail };
