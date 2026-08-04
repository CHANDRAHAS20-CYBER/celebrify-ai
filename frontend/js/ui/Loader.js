/* ==========================================================================
   ui/Loader.js — full-screen "composing your card" loading overlay, shown
   briefly on creator.html between the last wizard step and export.html.
   Depends on: helpers.js ($)
   ========================================================================== */

const LOADING_MESSAGES = [
  "Choosing the right words…",
  "Mixing the ink…",
  "Folding the paper…",
  "Adding a little gold leaf…",
  "Sealing the envelope…"
];

// Shows the overlay, cycles through LOADING_MESSAGES, then resolves after
// roughly LOADING_MESSAGES.length * 550ms + 300ms.
function runLoader() {
  return new Promise((resolve) => {
    const overlay = $("#loadingOverlay");
    const msgEl = $("#loadingMessage");
    if (!overlay) { resolve(); return; }
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");

    let i = 0;
    msgEl.textContent = LOADING_MESSAGES[0];
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      msgEl.textContent = LOADING_MESSAGES[i];
    }, 550);

    setTimeout(() => {
      clearInterval(interval);
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
      resolve();
    }, LOADING_MESSAGES.length * 550 + 300);
  });
}
