/* ==========================================================================
   config/razorpay.js — single place the Razorpay client is constructed.
   key_id is not secret (it's sent to the browser too); key_secret must
   never leave the server.
   ========================================================================== */

require("dotenv").config();
const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in your .env file. See .env.example.");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
