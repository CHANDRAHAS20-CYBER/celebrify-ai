/* ==========================================================================
   ui/Wizard.js — step navigation and the progress indicator for creator.html.
   Depends on: constants.js (STEP_LABELS, TOTAL_STEPS), helpers.js ($, $$,
   announce), storage.js (state)
   ========================================================================== */

function renderProgress() {
  const track = $("#progressTrack");
  if (!track) return;
  track.innerHTML = "";
  STEP_LABELS.forEach((label, i) => {
    const li = document.createElement("li");
    li.className = "progress__step";
    if (i < state.step) li.classList.add("is-complete");
    if (i === state.step) li.classList.add("is-current");
    li.innerHTML =
      '<span class="progress__dot">' + (i < state.step ? "✓" : i + 1) + "</span>" +
      '<span class="progress__label">' + label + "</span>";
    track.appendChild(li);
  });
}

function goToStep(index) {
  state.step = Math.max(0, Math.min(TOTAL_STEPS - 1, index));
  $$(".step").forEach((s) => s.classList.remove("is-active"));
  const target = $('.step[data-step="' + state.step + '"]');
  if (target) target.classList.add("is-active");
  renderProgress();
  $("#stepCurrent").textContent = String(state.step + 1);
  $("#stepTotal").textContent = String(TOTAL_STEPS);
  $("#prevBtn").disabled = state.step === 0;
  $("#nextBtn").textContent = state.step === TOTAL_STEPS - 1 ? "Generate my card" : "Continue";
  announce("Step " + (state.step + 1) + " of " + TOTAL_STEPS + ": " + STEP_LABELS[state.step]);
  if (target) {
    const legend = $(".step__title", target);
    if (legend) {
      legend.setAttribute("tabindex", "-1");
      legend.focus({ preventScroll: true });
    }
  }
  saveState();
}

function clearFieldError(step) {
  if (!step) return;
  $$(".field", step).forEach((f) => f.classList.remove("has-error"));
  $$(".field__error", step).forEach((e) => (e.textContent = ""));
}

function showFieldError(input, errorSelector, msg) {
  input.closest(".field").classList.add("has-error");
  $(errorSelector).textContent = msg;
  input.focus();
}
