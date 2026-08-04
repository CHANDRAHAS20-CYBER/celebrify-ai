/* ==========================================================================
   ui/Navbar.js — shared header behavior: the "start a new card" control.
   The brand link and nav links are plain <a href> — no JS needed for those
   since this is a real multi-page site now, not a single-page app.
   Depends on: helpers.js ($), storage.js (resetDraftState), ui/Modal.js
   ========================================================================== */

function initNavbar() {
  const restartBtn = $("#restartBtn");
  if (!restartBtn) return;
  restartBtn.addEventListener("click", async () => {
    const confirmed = await showConfirm("Start a new card? Your current answers will be cleared.");
    if (confirmed) {
      resetDraftState();
      clearUnlocked();
      window.location.href = "index.html";
    }
  });
}
