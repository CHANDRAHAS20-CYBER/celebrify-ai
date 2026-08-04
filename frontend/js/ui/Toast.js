/* ==========================================================================
   ui/Toast.js — tiny floating notification for transient errors/messages
   (upload rejected, checkout failed, etc.), used alongside inline errors.
   Depends on: helpers.js ($)
   ========================================================================== */

function showToast(message, tone) {
  let wrap = $("#toastStack");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toastStack";
    wrap.className = "toast-stack";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (tone === "error" ? " toast--error" : "");
  toast.textContent = message;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}
