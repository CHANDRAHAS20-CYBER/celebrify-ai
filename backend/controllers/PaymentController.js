/* ==========================================================================
   controllers/PaymentController.js — Razorpay version. The card design
   itself never touches the server (it's rendered entirely in the browser —
   see js/export.js), so this controller only ever handles two things:
     1. Creating a Razorpay Order for the fixed price below.
     2. Verifying that a completed payment's signature is genuine before
        the frontend is allowed to unlock downloads.
   ========================================================================== */

const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const logger = require("../utils/logger");
const { ok, fail } = require("../utils/response");

// Price is defined here, server-side, so it can't be tampered with from the
// browser. Amount is in the smallest currency unit (paise for INR).
const AMOUNT_PAISE = Number(process.env.AMOUNT_PAISE || 24900); // ₹249 default
const CURRENCY = process.env.CURRENCY || "INR";

async function createOrder(req, res) {
  try {
    const order = await razorpay.orders.create({
      amount: AMOUNT_PAISE,
      currency: CURRENCY,
      receipt: "card_" + Date.now(),
    });
    ok(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // public, safe to send to the browser
    });
  } catch (err) {
    logger.error("createOrder failed:", err.message);
    fail(res, 500, "Could not start checkout.");
  }
}

// Verifies the signature Razorpay's checkout returns after a successful
// payment. This is the ONLY step that should ever unlock downloads — never
// trust the browser saying "payment succeeded" without this check, since a
// user could fabricate that message without ever paying.
function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return fail(res, 400, "Missing payment details.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;
  if (!isValid) {
    logger.error("Signature mismatch for order:", razorpay_order_id);
  }
  ok(res, { paid: isValid });
}

// Handles the payment.captured webhook. Wire this up once you're ready to
// go beyond testing (see docs/API.md) — it's the reliable way to know a
// payment succeeded even if the visitor closes the tab before the browser
// ever calls verifyPayment above.
function handleWebhook(req, res) {
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(req.body)
    .digest("hex");

  if (signature !== expected) {
    logger.error("Webhook signature verification failed.");
    return res.sendStatus(400);
  }

  const event = JSON.parse(req.body.toString());
  if (event.event === "payment.captured") {
    logger.log("Payment captured for order:", event.payload.payment.entity.order_id);
  }
  res.sendStatus(200);
}

module.exports = { createOrder, verifyPayment, handleWebhook };
