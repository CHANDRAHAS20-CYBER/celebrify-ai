/* ==========================================================================
   utils/logger.js — tiny timestamped logger. Not a replacement for a real
   logging service in production, but keeps controllers free of raw
   console.log calls.
   ========================================================================== */

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

function error(...args) {
  console.error(new Date().toISOString(), ...args);
}

module.exports = { log, error };
