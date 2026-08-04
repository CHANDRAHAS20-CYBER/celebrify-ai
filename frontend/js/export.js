/* ==========================================================================
   export.js — rendering the final card to PNG / standalone HTML / PDF, and
   the export.html page logic (paywall + edit link). success.html reuses
   the render/download functions from this file too (see success.js).
   Depends on: constants.js, helpers.js, storage.js, preview.js,
   ui/Modal.js, ui/Navbar.js, ui/ThemeSwitcher.js
   ========================================================================== */

/* ---- PNG via canvas -------------------------------------------------- */

async function renderCardToCanvas() {
  const W = 900, H = 1200;
  const canvas = $("#exportCanvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const colors = resolveCardColors(state);

  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
  }

  drawRoundedRect(ctx, 0, 0, W, H, 46);
  ctx.save();
  ctx.clip();
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors.stops[0]);
  grad.addColorStop(0.55, colors.stops[1]);
  grad.addColorStop(1, colors.stops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (state.style === "elegant" || state.style === "luxury") {
    ctx.strokeStyle = state.style === "luxury" ? "rgba(230,200,119,0.6)" : "rgba(199,154,60,0.55)";
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 40);
    ctx.stroke();
  }
  if (state.style === "cartoon") {
    ctx.strokeStyle = "#2c2338";
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 4, 4, W - 8, H - 8, 46);
    ctx.stroke();
  }
  if (state.style === "neon") {
    ctx.strokeStyle = "#e26c86";
    ctx.lineWidth = 5;
    drawRoundedRect(ctx, 6, 6, W - 12, H - 12, 44);
    ctx.stroke();
  }
  ctx.restore();

  const textColor = colors.text;
  const bodyColor = colors.body;
  let cursorY = 130;

  const cover = state.photos && state.photos[0];
  if (cover) {
    try {
      const img = await loadImage(cover);
      const size = 340;
      const cx = W / 2, cy = cursorY + size / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      const scale = Math.max(size / img.width, size / img.height);
      const iw = img.width * scale, ih = img.height * scale;
      ctx.drawImage(img, cx - iw / 2, cy - ih / 2, iw, ih);
      ctx.restore();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.stroke();
      cursorY += size + 60;
    } catch (e) {
      cursorY += 20;
    }
  } else {
    cursorY += 20;
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.font = "600 52px Fraunces, serif";
  ctx.fillText(occasionLabel(state), W / 2, cursorY);
  cursorY += 50;

  const dateLabel = formatDate(state.cardDate);
  if (dateLabel) {
    ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = bodyColor;
    ctx.fillText(dateLabel.toUpperCase(), W / 2, cursorY);
    cursorY += 40;
  } else {
    cursorY += 20;
  }

  ctx.font = "400 32px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = bodyColor;
  const msgLines = (state.message || "").split("\n").flatMap((line) => wrapText(ctx, line, W - 220));
  const lineHeight = 44;
  const blockHeight = msgLines.length * lineHeight;
  const bottomReserved = 190;
  const available = H - bottomReserved - cursorY;
  let msgY = cursorY + Math.max(0, (available - blockHeight) / 2) + lineHeight;
  msgLines.forEach((line) => {
    ctx.fillText(line, W / 2, msgY);
    msgY += lineHeight;
  });

  ctx.font = "600 40px Caveat, cursive";
  ctx.fillStyle = textColor;
  const toName = (state.nickname || "").trim() || state.recipientName || "Someone Wonderful";
  ctx.fillText("To " + toName, W / 2, H - 130);
  ctx.fillText("— From " + (state.senderName || "You"), W / 2, H - 78);

  return canvas;
}

async function downloadPng() {
  const btn = $("#downloadPngBtn");
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Preparing PNG…";
  try {
    const canvas = await renderCardToCanvas();
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileBaseName(state) + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      btn.disabled = false;
      btn.textContent = original;
    }, "image/png");
  } catch (e) {
    btn.disabled = false;
    btn.textContent = original;
    showToast("Something went wrong preparing the PNG. Please try again.", "error");
  }
}

/* ---- Standalone HTML --------------------------------------------------- */

function buildStandaloneHtml() {
  const colors = resolveCardColors(state);
  const bg = "linear-gradient(165deg," + colors.stops[0] + "," + colors.stops[1] + " 60%," + colors.stops[2] + ")";
  const textColor = colors.text;
  const bodyColor = colors.body;
  const occasion = escapeHtml(occasionLabel(state));
  const dateLabel = escapeHtml(formatDate(state.cardDate));
  const message = escapeHtml(state.message || "").replace(/\n/g, "<br>");
  const toName = escapeHtml("To " + ((state.nickname || "").trim() || state.recipientName || "Someone Wonderful"));
  const from = escapeHtml("— From " + (state.senderName || "You"));
  const cover = state.photos && state.photos[0];
  const photoBlock = cover ? '<div class="photo"><img src="' + cover + '" alt=""></div>' : "";
  const frameBlock = state.style === "elegant" || state.style === "luxury" ? '<div class="frame"></div>' : "";
  const cartoonOutline = state.style === "cartoon" ? " cartoon" : "";
  const dateBlock = dateLabel ? '<p class="date">' + dateLabel + "</p>" : "";

  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "<title>A card for " + escapeHtml(state.recipientName || "you") + "</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=Plus+Jakarta+Sans:wght@400;600&family=Caveat:wght@600&display=swap" rel="stylesheet">',
    "<style>",
    "  :root{color-scheme:light;}",
    "  *{box-sizing:border-box;}",
    "  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;",
    "    background:#20182f;font-family:'Plus Jakarta Sans',sans-serif;padding:2rem;}",
    "  .card{width:min(420px,100%);aspect-ratio:3/4;border-radius:28px;",
    "    background:" + bg + ";color:" + textColor + ";padding:2.4rem 2rem;",
    "    box-shadow:0 30px 60px -25px rgba(0,0,0,0.6);position:relative;overflow:hidden;",
    "    display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.9rem;}",
    "  .card.cartoon{border:3px solid #2c2338;box-shadow:8px 8px 0 #2c2338;}",
    "  .frame{position:absolute;inset:14px;border:1.5px solid rgba(199,154,60,0.55);border-radius:20px;}",
    "  .photo{width:64%;aspect-ratio:1;border-radius:50%;overflow:hidden;",
    "    border:4px solid rgba(255,255,255,0.7);box-shadow:0 8px 20px -8px rgba(0,0,0,0.4);}",
    "  .photo img{width:100%;height:100%;object-fit:cover;display:block;}",
    "  .occasion{font-family:Fraunces,serif;font-weight:600;font-size:1.7rem;position:relative;z-index:1;}",
    "  .date{font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;color:" + bodyColor + ";opacity:0.7;margin-top:-0.6rem;}",
    "  .message{font-size:1.05rem;line-height:1.6;max-width:30ch;color:" + bodyColor + ";position:relative;z-index:1;}",
    "  .signoff{font-family:Caveat,cursive;font-size:1.6rem;display:flex;flex-direction:column;gap:0.2rem;position:relative;z-index:1;}",
    "  .footer-note{margin-top:1.5rem;color:rgba(255,255,255,0.4);font-size:0.75rem;text-align:center;}",
    "</style>",
    "</head>",
    "<body>",
    '  <div class="card' + cartoonOutline + '">',
    "    " + frameBlock,
    "    " + photoBlock,
    '    <p class="occasion">' + occasion + "</p>",
    "    " + dateBlock,
    '    <p class="message">' + (message || "You mean the world to me.") + "</p>",
    '    <p class="signoff"><span>' + toName + "</span><span>" + from + "</span></p>",
    "  </div>",
    '  <p class="footer-note">Made with Celebrify-AI</p>',
    "</body>",
    "</html>"
  ].join("\n");
}

function downloadHtml() {
  const html = buildStandaloneHtml();
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileBaseName(state) + ".html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---- Print / PDF -------------------------------------------------------- */

function downloadPdf() {
  function onAfterPrint() {
    document.body.classList.remove("is-printing");
    window.removeEventListener("afterprint", onAfterPrint);
  }
  window.addEventListener("afterprint", onAfterPrint);
  document.body.classList.add("is-printing");
  requestAnimationFrame(() => window.print());
}

/* ---- Shared wiring for the (post-unlock) download buttons --------------- */

function wireDownloadButtons() {
  $("#downloadPngBtn").addEventListener("click", downloadPng);
  $("#downloadHtmlBtn").addEventListener("click", downloadHtml);
  $("#downloadPdfBtn").addEventListener("click", downloadPdf);
}

function revealDownloads() {
  const paywall = $("#paywallBlock");
  if (paywall) paywall.classList.add("is-unlocked");
  $("#downloadButtons").hidden = false;
}

/* ---- export.html page init ----------------------------------------------- */

function initExportPage() {
  loadState();
  initThemeSwitcher();
  initNavbar();
  applyCardData("result");

  const editBtn = $("#editBtn");
  if (editBtn) editBtn.addEventListener("click", () => { window.location.href = "creator.html"; });

  wireDownloadButtons();

  if (isUnlocked()) {
    revealDownloads();
  } else {
    const unlockBtn = $("#unlockBtn");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", () => {
        window.location.href = "payment.html";
      });
    }
  }
}

// Only auto-run on export.html (identified by the presence of #unlockBtn or
// #paywallBlock); success.html includes this file for its functions but
// drives its own init from success.js.
document.addEventListener("DOMContentLoaded", () => {
  if ($("#paywallBlock")) initExportPage();
});
