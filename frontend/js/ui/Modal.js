/* ==========================================================================
   ui/Modal.js — the app's own confirm dialog. Native window.confirm() is
   avoided because it is silently blocked inside some sandboxed preview
   panes, which makes buttons that rely on it look broken.
   Depends on: helpers.js ($)
   ========================================================================== */

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = $("#confirmOverlay");
    if (!overlay) { resolve(window.confirm(message)); return; }
    const msgEl = $("#confirmMessage");
    const okBtn = $("#confirmOkBtn");
    const cancelBtn = $("#confirmCancelBtn");
    msgEl.textContent = message;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    okBtn.focus();

    function cleanup(result) {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      overlay.removeEventListener("keydown", onKeydown);
      resolve(result);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onKeydown(e) {
      if (e.key === "Escape") cleanup(false);
    }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    overlay.addEventListener("keydown", onKeydown);
  });
}
