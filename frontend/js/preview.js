/* ==========================================================================
   preview.js — renders the current draft into a .card element. Shared by
   creator.html (live preview, prefix "card"), export.html and success.html
   (prefix "result").
   Depends on: helpers.js ($, occasionLabel, formatDate), storage.js (state)
   ========================================================================== */

function applyCardData(prefix) {
  const card = $("#" + prefix + "Card");
  if (!card) return;
  card.dataset.style = state.style;
  card.dataset.theme = state.theme;

  const photoWrap = $("#" + prefix + "PhotoWrap");
  const photo = $("#" + prefix + "Photo");
  const cover = state.photos && state.photos[0];
  if (photoWrap && photo) {
    if (cover) {
      photo.src = cover;
      photoWrap.hidden = false;
    } else {
      photoWrap.hidden = true;
    }
  }

  const occasionEl = $("#" + prefix + "Occasion");
  if (occasionEl) occasionEl.textContent = occasionLabel(state);

  const dateEl = $("#" + prefix + "DateDisplay");
  const formatted = formatDate(state.cardDate);
  if (dateEl) {
    dateEl.textContent = formatted;
    dateEl.hidden = !formatted;
  }

  const messageEl = $("#" + prefix + "Message");
  if (messageEl) messageEl.textContent = state.message || "Your message will appear here as you write it.";

  const toEl = $("#" + prefix + "To");
  const fromEl = $("#" + prefix + "From");
  const toName = (state.nickname || "").trim() || state.recipientName || "Someone Wonderful";
  if (toEl) toEl.textContent = "To " + toName;
  if (fromEl) fromEl.textContent = "— From " + (state.senderName || "You");
}

function updatePreview() {
  applyCardData("card");
}
