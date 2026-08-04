/* ==========================================================================
   creator.js — page logic for creator.html (the wizard).
   Depends on: constants.js, helpers.js, storage.js, validator.js,
   preview.js, uploader.js, ui/Wizard.js, ui/ThemeSwitcher.js, ui/Navbar.js,
   ui/Loader.js, ui/Modal.js
   ========================================================================== */

function renderOptionGrid(container, items, stateKey, onAfterSelect) {
  if (!container) return;
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "option-card";
    card.setAttribute("role", "radio");
    card.dataset.key = item.key;
    const selected = state[stateKey] === item.key;
    card.setAttribute("aria-checked", String(selected));
    if (selected) card.classList.add("is-selected");
    card.innerHTML =
      '<span class="option-card__icon" aria-hidden="true">' + item.icon + "</span>" +
      '<span class="option-card__name">' + item.name + "</span>" +
      (item.desc ? '<span class="option-card__desc">' + item.desc + "</span>" : "");
    card.addEventListener("click", () => {
      state[stateKey] = item.key;
      $$(".option-card", container).forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("is-selected");
      card.setAttribute("aria-checked", "true");
      if (onAfterSelect) onAfterSelect(item);
      updatePreview();
      saveState();
      clearFieldError(card.closest(".step"));
    });
    container.appendChild(card);
  });
}

function renderRecipientGrid() {
  renderOptionGrid($('[data-key="recipient"] .option-grid'), RECIPIENTS, "recipient", () => {
    $("#customRecipientField").hidden = state.recipient !== "custom";
  });
}

function renderOccasionGrid(filterText) {
  const grid = $("#occasionGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const query = (filterText || "").trim().toLowerCase();
  let anyVisible = false;

  OCCASION_GROUPS.forEach((group) => {
    const matches = group.items.filter((item) => !query || item.name.toLowerCase().includes(query));
    if (!matches.length) return;
    anyVisible = true;
    const label = document.createElement("p");
    label.className = "option-group__label";
    label.textContent = group.label;
    grid.appendChild(label);

    matches.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      card.setAttribute("role", "radio");
      card.dataset.key = item.key;
      const selected = state.occasion === item.key;
      card.setAttribute("aria-checked", String(selected));
      if (selected) card.classList.add("is-selected");
      card.innerHTML =
        '<span class="option-card__icon" aria-hidden="true">' + item.icon + "</span>" +
        '<span class="option-card__name">' + item.name + "</span>";
      card.addEventListener("click", () => {
        state.occasion = item.key;
        $$(".option-card", grid).forEach((c) => {
          c.classList.remove("is-selected");
          c.setAttribute("aria-checked", "false");
        });
        card.classList.add("is-selected");
        card.setAttribute("aria-checked", "true");
        toggleCustomOccasion();
        renderSuggestionChips();
        updatePreview();
        saveState();
        clearFieldError(card.closest(".step"));
      });
      grid.appendChild(card);
    });
  });

  $("#occasionEmptyHint").hidden = anyVisible;
}

function renderStyleGrid() {
  renderOptionGrid($('[data-key="style"] .option-grid'), STYLES, "style", () => {
    applyThemeLockState();
  });
}

function renderSwatchGrid() {
  const container = $("#swatchGrid");
  container.innerHTML = "";
  THEMES.forEach((theme) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.setAttribute("role", "radio");
    btn.dataset.key = theme.key;
    const selected = state.theme === theme.key;
    btn.setAttribute("aria-checked", String(selected));
    if (selected) btn.classList.add("is-selected");
    btn.innerHTML =
      '<span class="swatch__chip" style="background:' + theme.swatch + '"></span>' +
      '<span class="swatch__name">' + theme.name + "</span>";
    btn.addEventListener("click", () => {
      state.theme = theme.key;
      $$(".swatch", container).forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-checked", "true");
      updatePreview();
      saveState();
    });
    container.appendChild(btn);
  });
  applyThemeLockState();
}

function applyThemeLockState() {
  const grid = $("#swatchGrid");
  const hint = $("#themeHint");
  if (!grid || !hint) return;
  const locked = FIXED_PALETTE_STYLES.includes(state.style);
  grid.classList.toggle("is-disabled", locked);
  grid.setAttribute("aria-disabled", String(locked));
  if (locked) {
    const styleName = (STYLES.find((s) => s.key === state.style) || {}).name || "This style";
    hint.textContent = styleName + " has its own built-in palette, so the color theme below is set aside for now.";
    hint.classList.add("is-locked");
  } else {
    hint.textContent = "Sets the palette for the whole card.";
    hint.classList.remove("is-locked");
  }
}

function toggleCustomOccasion() {
  const field = $("#customOccasionField");
  if (field) field.hidden = state.occasion !== "custom";
}

function renderSuggestionChips() {
  const wrap = $("#suggestionChips");
  if (!wrap) return;
  wrap.innerHTML = "";
  const list = SUGGESTIONS[state.occasion] || SUGGESTIONS.custom;
  list.forEach((text) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = text;
    chip.addEventListener("click", () => {
      const textarea = $("#messageText");
      textarea.value = text;
      state.message = text;
      $("#messageCount").textContent = String(text.length);
      updatePreview();
      saveState();
      textarea.focus();
    });
    wrap.appendChild(chip);
  });
}

function wireTextInputs() {
  $("#customRecipient").addEventListener("input", (e) => {
    state.customRecipient = e.target.value;
    e.target.setCustomValidity("");
    saveState();
  });

  $("#customOccasion").addEventListener("input", (e) => {
    state.customOccasion = e.target.value;
    e.target.setCustomValidity("");
    updatePreview();
    saveState();
  });

  $("#occasionSearch").addEventListener("input", (e) => renderOccasionGrid(e.target.value));

  $("#recipientName").addEventListener("input", (e) => {
    state.recipientName = e.target.value;
    clearFieldError(e.target.closest(".step"));
    updatePreview();
    saveState();
  });

  $("#senderName").addEventListener("input", (e) => {
    state.senderName = e.target.value;
    clearFieldError(e.target.closest(".step"));
    updatePreview();
    saveState();
  });

  $("#nickname").addEventListener("input", (e) => {
    state.nickname = e.target.value;
    updatePreview();
    saveState();
  });

  $("#cardDate").addEventListener("input", (e) => {
    state.cardDate = e.target.value;
    updatePreview();
    saveState();
  });

  const textarea = $("#messageText");
  textarea.addEventListener("input", (e) => {
    state.message = e.target.value;
    $("#messageCount").textContent = String(e.target.value.length);
    clearFieldError(e.target.closest(".step"));
    updatePreview();
    saveState();
  });
}

function renderAll() {
  renderRecipientGrid();
  renderOccasionGrid($("#occasionSearch").value);
  renderStyleGrid();
  renderSwatchGrid();
  renderPhotoGallery();
  toggleCustomOccasion();
  renderSuggestionChips();
  updatePreview();
}

async function handleGenerate() {
  saveState();
  clearUnlocked(); // a freshly generated card starts locked again
  await runLoader();
  window.location.href = "export.html";
}

function initCreatorPage() {
  loadState();

  renderRecipientGrid();
  renderOccasionGrid("");
  renderStyleGrid();
  renderSwatchGrid();
  renderPhotoGallery();
  toggleCustomOccasion();
  renderSuggestionChips();

  // Restore text field values from a saved draft
  $("#customRecipient").value = state.customRecipient || "";
  $("#customOccasion").value = state.customOccasion || "";
  $("#recipientName").value = state.recipientName || "";
  $("#senderName").value = state.senderName || "";
  $("#nickname").value = state.nickname || "";
  $("#cardDate").value = state.cardDate || "";
  $("#messageText").value = state.message || "";
  $("#messageCount").textContent = String((state.message || "").length);
  $("#customRecipientField").hidden = state.recipient !== "custom";

  wireTextInputs();
  wireUploader();
  initThemeSwitcher();
  initNavbar();
  renderProgress();
  updatePreview();
  goToStep(state.step || 0);

  $("#prevBtn").addEventListener("click", () => goToStep(state.step - 1));
  $("#nextBtn").addEventListener("click", () => {
    if (!validateStep()) return;
    if (state.step === TOTAL_STEPS - 1) {
      handleGenerate();
    } else {
      goToStep(state.step + 1);
    }
  });
}

document.addEventListener("DOMContentLoaded", initCreatorPage);
