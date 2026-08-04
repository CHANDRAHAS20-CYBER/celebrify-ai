# Celebrify-AI backend API

The backend has exactly two jobs: create a Razorpay Order, and verify a
completed payment's signature. It never sees or stores the card design —
that's rendered entirely in the browser (`js/export.js`) and lives in
`localStorage` on the visitor's device.

Base URL: whatever `API_BASE_URL` is set to in `js/constants.js` (e.g.
`http://localhost:8080` locally, or your deployed backend's URL).

---

## `POST /api/create-order`

Creates a Razorpay Order for the fixed price configured server-side
(`AMOUNT_PAISE` in `.env`). Takes no request body — the amount is decided
by the server, never the client, so it can't be tampered with.

**Response `200`**
```json
{
  "orderId": "order_ABC123",
  "amount": 24900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxxxxxxxxxxx"
}
```
`keyId` is Razorpay's public key — safe to expose to the browser, used to
open the Checkout modal.

**Response `500`** — `{ "error": "Could not start checkout." }` if Razorpay's
API call failed (bad credentials, network issue, etc.)

---

## `POST /api/verify-payment`

Verifies a completed payment's HMAC signature. Called both by
`js/payment.js` immediately after checkout, and again by `js/success.js`
on page load (belt-and-suspenders — either call unlocking downloads is
fine, since both hit the same verification logic).

**Request body**
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "hex-encoded hmac"
}
```

**Response `200`**
```json
{ "paid": true }
```
`paid` is `false` (not an error) if the signature doesn't match — that's
the normal shape of "this wasn't a genuine payment," not a server fault.

**Response `400`** — missing fields in the request body.

---

## `POST /api/razorpay-webhook`

Optional but recommended once you're past testing. Configure this URL in
your Razorpay Dashboard → Account & Settings → Webhooks, subscribed to the
`payment.captured` event, and set `RAZORPAY_WEBHOOK_SECRET` in `.env` to
match. This is the reliable way to know a payment succeeded even if the
visitor closes the tab before the browser ever calls `/api/verify-payment`
— right now the webhook handler just logs the event; extend
`handleWebhook` in `PaymentController.js` if you want it to email a
receipt, record the sale somewhere, etc.

---

## `GET /health`

Returns `{ "status": "ok" }`. Useful for uptime checks once deployed.
