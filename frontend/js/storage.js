/* ==========================================================================
   storage.js — the single source of truth for the card being designed,
   plus localStorage/sessionStorage persistence. Loaded on every page that
   reads or writes the draft (creator, preview, export, success).
   Depends on: constants.js
   ========================================================================== */

const state = {
  step: 0,
  recipient: "",
  customRecipient: "",
  occasion: "",
  customOccasion: "",
  style: "elegant",
  theme: "blush",
  photos: [],           // array of base64 data URLs, first is the "cover"
  videoName: "",
  audioName: "",
  recipientName: "",
  senderName: "",
  nickname: "",
  cardDate: "",
  message: ""
};

// Video/audio blobs are kept out of `state` (large, don't serialize well)
// and live only for the current tab's session.
const media = { videoUrl: "", audioUrl: "" };

function saveState() {
  try {
    // Skip persisting photos to keep storage light; everything else about
    // the draft is worth keeping.
    const { photos, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch (e) {
    /* localStorage may be unavailable (private mode, quota) — fail quietly */
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(state, saved, { photos: state.photos });
  } catch (e) {
    /* corrupted or inaccessible data — start fresh */
  }
}

function resetDraftState() {
  Object.assign(state, {
    step: 0,
    recipient: "",
    customRecipient: "",
    occasion: "",
    customOccasion: "",
    style: "elegant",
    theme: "blush",
    photos: [],
    videoName: "",
    audioName: "",
    recipientName: "",
    senderName: "",
    nickname: "",
    cardDate: "",
    message: ""
  });
  if (media.videoUrl) URL.revokeObjectURL(media.videoUrl);
  if (media.audioUrl) URL.revokeObjectURL(media.audioUrl);
  media.videoUrl = "";
  media.audioUrl = "";
  saveState();
}

// ---- Payment-unlock flag, scoped to the browser tab's session -------------

function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_FLAG_KEY) === "1";
  } catch (e) {
    return false;
  }
}

function markUnlocked() {
  try { sessionStorage.setItem(UNLOCK_FLAG_KEY, "1"); } catch (e) { /* ignore */ }
}

function clearUnlocked() {
  try { sessionStorage.removeItem(UNLOCK_FLAG_KEY); } catch (e) { /* ignore */ }
}
