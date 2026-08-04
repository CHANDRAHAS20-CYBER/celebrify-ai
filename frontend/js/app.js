/* ==========================================================================
   app.js — page logic for index.html (the landing page) and shared init
   for any simple static page (about/contact/privacy/terms) that just needs
   the header's dark/light toggle and restart button wired up.
   Depends on: constants.js, helpers.js, storage.js, ui/ThemeSwitcher.js,
   ui/Navbar.js
   ========================================================================== */

function renderFeaturedOccasions() {
  const wrap = $("#featuredOccasions");
  if (!wrap) return;
  wrap.innerHTML = "";
  FEATURED_OCCASION_KEYS.forEach((key) => {
    const occ = OCCASIONS.find((o) => o.key === key);
    if (!occ) return;
    const chip = document.createElement("a");
    chip.href = "creator.html";
    chip.className = "occasion-chip";
    chip.innerHTML = '<span aria-hidden="true">' + occ.icon + "</span><span>" + occ.name + "</span>";
    chip.addEventListener("click", () => {
      loadState();
      state.occasion = occ.key;
      state.step = 0;
      saveState();
    });
    wrap.appendChild(chip);
  });
}

function initLandingPage() {
  initThemeSwitcher();
  initNavbar();
  renderFeaturedOccasions();
}

document.addEventListener("DOMContentLoaded", initLandingPage);
