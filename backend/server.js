/* ==========================================================================
   server.js — entry point. Mounts the payment routes and the raw-body
   webhook route (which must NOT go through express.json(), hence it's
   registered separately, before the JSON body parser).
   ========================================================================== */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PaymentController = require("./controllers/PaymentController");
const paymentRoutes = require("./routes/payment.routes");
const logger = require("./utils/logger");

const app = express();
app.use(cors());

// Razorpay webhook needs the raw request body to verify its signature, so
// it must be registered before express.json() below.
app.post("/api/razorpay-webhook", express.raw({ type: "application/json" }), PaymentController.handleWebhook);

app.use(express.json());
app.use("/api", paymentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.log(`Celebrify-AI payment server (Razorpay) running on port ${port}`);
  logger.log(`Expecting the frontend at: ${process.env.PUBLIC_URL || "http://localhost:8000"}`);
});
