# Architecture

## What exists today (Phase 1)

**Frontend** — a real multi-page static site, no framework, no build step:

- `index.html` — landing page
- `creator.html` — the 6-step wizard, with a live preview rendered from
  `state` (see `js/storage.js`)
- `export.html` — shows the finished card behind a paywall
- `payment.html` — opens the Razorpay Checkout modal
- `success.html` — verifies the payment server-side, then unlocks the
  PNG / HTML / PDF download buttons

The card itself (`.card` in `css/preview.css` + `css/themes.css`) is never
rendered on a server — every page that shows it does so client-side from
whatever is in `state`, which is persisted to `localStorage` as the user
works (see `js/storage.js`). Downloads (PNG via `<canvas>`, standalone
HTML, print-to-PDF) are all generated in the browser too, in `js/export.js`
— the backend never touches the design.

**Backend** — a minimal Express server (`backend/`) whose only job is
talking to Razorpay: creating an Order, and verifying a completed
payment's signature before the frontend is allowed to unlock downloads.
See `docs/API.md` for the two endpoints.

**Why downloads are actually gated:** everything client-side can in
principle be inspected or bypassed, so the real gate isn't JavaScript
hiding the buttons — it's that `js/export.js`'s download functions are
only ever wired up (`wireDownloadButtons()`) after `success.js` gets back
`{ "paid": true }` from the backend, which itself only returns `true` after
checking a cryptographic signature only Razorpay could have produced.

## What's deferred to later phases

- **Accounts + database** — `login.html`, `signup.html`, `dashboard.html`,
  `profile.html` don't exist yet. Building them without real auth and a
  database behind them would just be decoration; this needs its own pass
  (user model, sessions/JWT, a real database instead of localStorage).
- **The animation engine** — the `engine/`, `scenes/`, and `templates/`
  system (balloon pops, cake-cutting, fireworks, per-occasion sequences).
  This is the single largest remaining piece — a timeline/scene manager,
  a particle/physics layer, and ~20 occasion-specific template scripts
  built on top of it. Deserves its own dedicated build rather than being
  squeezed in alongside everything else.
- **Static content pages** — `about.html`, `contact.html`, `privacy.html`,
  `terms.html`, `404.html` — quick to add, just not built yet.
- **Asset pipelines, tests** — `assets/`, `uploads/`, `generated/`,
  `database/`, `tests/` from the original project tree all assume pieces
  (server-side storage, a database, testable business logic) that don't
  exist yet in this phase.

## Deployment shape

```
                 ┌────────────┐        ┌──────────────────┐
   visitor  ───▶ │  frontend  │        │  backend/server.js │
                 │ (static)   │──HTTP─▶│  (Express + Razorpay)│
                 └────────────┘        └──────────────────┘
                                                 │
                                                 ▼
                                          Razorpay's API
```

The frontend can be hosted anywhere that serves static files (Netlify,
Vercel, GitHub Pages, or the nginx container in `deployment/`). The
backend needs an actual Node process running somewhere (Render, Railway,
or the Docker setup in `deployment/`) — it can't be a static host, since it
holds the Razorpay secret key and does the signature verification.
