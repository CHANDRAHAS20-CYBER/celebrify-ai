/* ==========================================================================
   payment.js — page logic for payment.html (Razorpay version). Unlike
   Stripe's hosted redirect, Razorpay Checkout is a JS modal that opens on
   top of this page, so this file: asks the backend to create an Order,
   opens the modal with that order, and on success sends the result back to
   the backend to verify before ever redirecting to success.html.
   Depends on: helpers.js (apiBase), storage.js (state), the Razorpay
   Checkout.js script tag in payment.html
   ========================================================================== */

let currentOrder = null;

async function createOrder() {
  const res = await fetch(apiBase() + "/api/create-order", { method: "POST" });
  if (!res.ok) throw new Error("bad status " + res.status);
  const data = await res.json();
  if (!data.orderId) throw new Error("missing orderId");
  return data;
}

function openCheckout(order) {
  const options = {
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    order_id: order.orderId,
    name: "Celebrify-AI",
    description: "Greeting card download",
    prefill: {
      name: state.senderName || "",
    },
    theme: { color: "#c6395a" },
    handler: function (response) {
      verifyAndRedirect(response);
    },
    modal: {
      ondismiss: function () {
        $("#paymentStatus").textContent = "Checkout closed.";
        $("#payNowBtn").disabled = false;
        $("#payNowBtn").textContent = "Pay now";
      },
    },
  };
  const rzp = new Razorpay(options);
  rzp.on("payment.failed", function (response) {
    const errorBox = $("#paymentError");
    errorBox.hidden = false;
    errorBox.textContent = "Payment failed: " + (response.error && response.error.description ? response.error.description : "please try again.");
    $("#payNowBtn").disabled = false;
    $("#payNowBtn").textContent = "Pay now";
  });
  rzp.open();
}

async function verifyAndRedirect(response) {
  $("#paymentStatus").textContent = "Confirming your payment…";
  try {
    const res = await fetch(apiBase() + "/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });
    const data = await res.json();
    const params = new URLSearchParams({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      verified: data.paid ? "1" : "0",
    });
    window.location.href = "success.html?" + params.toString();
  } catch (e) {
    const errorBox = $("#paymentError");
    errorBox.hidden = false;
    errorBox.textContent = "Couldn't confirm the payment with our server. If you were charged, please get in touch.";
  }
}

async function handlePayClick() {
  const btn = $("#payNowBtn");
  const errorBox = $("#paymentError");
  errorBox.hidden = true;
  btn.disabled = true;
  btn.textContent = "Loading checkout…";
  $("#paymentStatus").textContent = "Opening secure checkout…";
  try {
    if (typeof Razorpay === "undefined") throw new Error("razorpay script not loaded");
    currentOrder = await createOrder();
    $("#paymentAmount").textContent = "₹" + (currentOrder.amount / 100).toFixed(0);
    openCheckout(currentOrder);
    btn.disabled = false;
    btn.textContent = "Pay now";
  } catch (e) {
    $("#paymentStatus").textContent = "Couldn't start checkout.";
    errorBox.hidden = false;
    errorBox.textContent = "We couldn't reach the payment server at " + apiBase() + ", or the Razorpay script didn't load. Check that backend/server.js is running.";
    btn.disabled = false;
    btn.textContent = "Pay now";
  }
}

function initPaymentPage() {
  loadState();
  if (!state.recipientName && !state.message) {
    window.location.href = "creator.html";
    return;
  }
  $("#payNowBtn").addEventListener("click", handlePayClick);
  $("#cancelPaymentBtn").addEventListener("click", () => { window.location.href = "export.html"; });
}

document.addEventListener("DOMContentLoaded", initPaymentPage);
