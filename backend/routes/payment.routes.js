/* ==========================================================================
   routes/payment.routes.js — maps HTTP endpoints to PaymentController
   (Razorpay version).
   ========================================================================== */

const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");

router.post("/create-order", PaymentController.createOrder);
router.post("/verify-payment", PaymentController.verifyPayment);

module.exports = router;
