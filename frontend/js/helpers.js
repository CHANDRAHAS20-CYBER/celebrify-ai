/* ==========================================================================
   helpers.js — small, dependency-free utility functions used everywhere.
   Depends on: constants.js (for THEME_COLORS / FIXED_STYLE_COLORS)
   ========================================================================== */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function announce(msg) {
  const region = $("#liveRegion");
  if (region) region.textContent = msg;
}

function occasionLabel(state) {
  if (state.occasion === "custom") return state.customOccasion || "A Special Day";
  const found = OCCASIONS.find((o) => o.key === state.occasion);
  return found ? found.name : "Happy Birthday";
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function themeFor(themeKey) {
  return THEME_COLORS[themeKey] || THEME_COLORS.blush;
}

// Resolves the actual gradient stops + text colors a card should render
// with: styles in FIXED_PALETTE_STYLES ignore the chosen color theme and
// use their own fixed palette instead (mirrors themes.css).
function resolveCardColors(state) {
  const fixed = FIXED_STYLE_COLORS[state.style];
  if (fixed) return { stops: fixed.stops, text: fixed.text, body: fixed.body };
  const theme = themeFor(state.theme);
  return { stops: theme.stops, text: theme.text, body: theme.text };
}

function fileBaseName(state) {
  const name = (state.recipientName || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return "greeting-card-for-" + (name || "someone");
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function apiBase() {
  return (window.CELEBRIFY_CONFIG && window.CELEBRIFY_CONFIG.API_BASE_URL) || "";
}

// ---- Canvas helpers, used by export.js for PNG rendering ------------------

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
