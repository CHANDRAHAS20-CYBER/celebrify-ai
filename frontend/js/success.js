/* ==========================================================================
   success.js — page logic for success.html (Razorpay version), where
   payment.js redirects to after the checkout modal closes. This is the
   ONLY place downloads get unlocked: it asks the backend to confirm the
   payment signature was genuine before revealing anything — the "verified"
   query param set by payment.js is just a hint for the loading message,
   never trusted on its own.
   Depends on: helpers.js, storage.js, preview.js, export.js (for the
   render/download functions + wireDownloadButtons/revealDownloads),
   particles.js
   ========================================================================== */

async function verifyAndUnlock() {
  const statusEl = $("#successStatus");
  const errorBox = $("#successError");
  const orderId = getQueryParam("razorpay_order_id");
  const paymentId = getQueryParam("razorpay_payment_id");
  const signature = getQueryParam("razorpay_signature");

  if (!orderId || !paymentId || !signature) {
    statusEl.textContent = "No payment details found.";
    errorBox.hidden = false;
    errorBox.textContent = "It looks like you opened this page directly. Head back and use the \u201cPay now\u201d button instead.";
    return;
  }

  statusEl.textContent = "Confirming your payment…";
  try {
    const res = await fetch(apiBase() + "/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });
    const data = await res.json();
    if (data.paid) {
      markUnlocked();
      statusEl.textContent = "Payment confirmed — your card is unlocked.";
      applyCardData("result");
      wireDownloadButtons();
      revealDownloads();
      const seal = $("#stampSeal");
      if (seal) {
        seal.classList.remove("is-stamping");
        void seal.offsetWidth;
        seal.classList.add("is-stamping");
      }
      setTimeout(() => fireConfetti(), 350);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      statusEl.textContent = "We couldn't confirm that payment.";
      errorBox.hidden = false;
      errorBox.textContent = "The payment signature didn't check out. If you were charged, please get in touch so we can sort it out.";
    }
  } catch (e) {
    statusEl.textContent = "Couldn't reach the payment server.";
    errorBox.hidden = false;
    errorBox.textContent = "Confirm backend/server.js is running and reachable at " + apiBase() + ", then refresh this page.";
  }
}

function initSuccessPage() {
  loadState();
  initThemeSwitcher();
  initNavbar();
  applyCardData("result");
  verifyAndUnlock();

  const editBtn = $("#editBtn");
  if (editBtn) editBtn.addEventListener("click", () => { window.location.href = "creator.html"; });
}

document.addEventListener("DOMContentLoaded", initSuccessPage);
