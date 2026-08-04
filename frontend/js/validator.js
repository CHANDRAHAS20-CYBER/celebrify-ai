/* ==========================================================================
   validator.js — per-step validation for the wizard on creator.html.
   Depends on: constants.js (STEP_LABELS), helpers.js ($), storage.js
   (state), ui/Wizard.js (showFieldError)
   ========================================================================== */

// Validates the currently visible step. Returns true if the user may
// continue; otherwise shows inline errors and returns false.
function validateStep() {
  const key = STEP_LABELS[state.step];

  if (key === "Recipient") {
    if (!state.recipient) {
      announce("Please choose who this card is for.");
      return false;
    }
    if (state.recipient === "custom" && !state.customRecipient.trim()) {
      const input = $("#customRecipient");
      input.setCustomValidity("required");
      input.reportValidity();
      return false;
    }
  }

  if (key === "Occasion") {
    if (!state.occasion) {
      announce("Please choose an occasion.");
      return false;
    }
    if (state.occasion === "custom" && !state.customOccasion.trim()) {
      const input = $("#customOccasion");
      input.setCustomValidity("required");
      input.reportValidity();
      return false;
    }
  }

  if (key === "Personalize") {
    let ok = true;
    const nameField = $("#recipientName");
    const senderField = $("#senderName");
    const textarea = $("#messageText");
    if (!nameField.value.trim()) {
      showFieldError(nameField, "#recipientNameError", "Add the recipient's name.");
      ok = false;
    }
    if (!senderField.value.trim()) {
      showFieldError(senderField, "#senderNameError", "Add your name.");
      ok = false;
    }
    if (!textarea.value.trim()) {
      showFieldError(textarea, "#messageError", "Write a short message before continuing.");
      ok = false;
    }
    return ok;
  }

  return true;
}
