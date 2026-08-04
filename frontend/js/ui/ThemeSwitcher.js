/* ==========================================================================
   ui/ThemeSwitcher.js — dark/light mode toggle, shared header control.
   Depends on: constants.js (COLOR_MODE_KEY), helpers.js ($)
   ========================================================================== */

function applyColorMode(mode) {
  document.documentElement.setAttribute("data-color-mode", mode);
  const icon = $("#colorModeIcon");
  const btn = $("#colorModeBtn");
  const label = $("#colorModeLabel");
  if (icon) icon.textContent = mode === "light" ? "☀️" : "🌙";
  if (btn) btn.setAttribute("aria-pressed", String(mode === "light"));
  if (label) label.textContent = mode === "light" ? "Switch to dark mode" : "Switch to light mode";
}

function initThemeSwitcher() {
  let mode = "dark";
  try {
    mode = localStorage.getItem(COLOR_MODE_KEY) || "dark";
  } catch (e) { /* ignore */ }
  applyColorMode(mode);

  const btn = $("#colorModeBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-color-mode") === "light" ? "dark" : "light";
    applyColorMode(next);
    try { localStorage.setItem(COLOR_MODE_KEY, next); } catch (e) { /* ignore */ }
  });
}
