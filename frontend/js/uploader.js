/* ==========================================================================
   uploader.js — photo gallery (up to MAX_PHOTOS) plus optional video/voice
   attachments, used on the "Upload" step of creator.html.
   Depends on: constants.js (MAX_PHOTOS), helpers.js ($, announce),
   storage.js (state, media), preview.js (updatePreview)
   ========================================================================== */

function renderPhotoGallery() {
  const gallery = $("#photoGallery");
  if (!gallery) return;
  gallery.innerHTML = "";
  state.photos.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "photo-gallery__item" + (i === 0 ? " is-cover" : "");
    item.innerHTML =
      '<img src="' + src + '" alt="Uploaded photo ' + (i + 1) + '">' +
      '<button type="button" class="photo-gallery__remove" aria-label="Remove photo ' + (i + 1) + '">×</button>';
    item.querySelector(".photo-gallery__remove").addEventListener("click", () => {
      state.photos.splice(i, 1);
      renderPhotoGallery();
      updatePreview();
    });
    gallery.appendChild(item);
  });
  const dropzone = $("#dropzone");
  if (dropzone) dropzone.hidden = state.photos.length >= MAX_PHOTOS;
}

function wireUploader() {
  const input = $("#imageInput");
  const dropzone = $("#dropzone");
  if (!input || !dropzone) return;

  function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    const room = MAX_PHOTOS - state.photos.length;
    files.slice(0, room).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        showToast("One photo was larger than 8MB and was skipped.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        state.photos.push(reader.result);
        renderPhotoGallery();
        updatePreview();
      };
      reader.readAsDataURL(file);
    });
    if (files.length > room) {
      showToast("Only the first " + MAX_PHOTOS + " photos are used.");
    }
  }

  input.addEventListener("change", (e) => {
    handleFiles(e.target.files);
    input.value = "";
  });

  ["dragover", "dragenter"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
    })
  );
  dropzone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));

  // Optional video
  const videoInput = $("#videoInput");
  const videoPreview = $("#videoPreview");
  const videoEl = $("#videoPreviewEl");
  if (videoInput) {
    videoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (media.videoUrl) URL.revokeObjectURL(media.videoUrl);
      media.videoUrl = URL.createObjectURL(file);
      state.videoName = file.name;
      videoEl.src = media.videoUrl;
      videoPreview.hidden = false;
      saveState();
    });
    $("#removeVideoBtn").addEventListener("click", () => {
      if (media.videoUrl) URL.revokeObjectURL(media.videoUrl);
      media.videoUrl = "";
      state.videoName = "";
      videoInput.value = "";
      videoEl.removeAttribute("src");
      videoPreview.hidden = true;
      saveState();
    });
  }

  // Optional voice message
  const audioInput = $("#audioInput");
  const audioPreview = $("#audioPreview");
  const audioEl = $("#audioPreviewEl");
  if (audioInput) {
    audioInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (media.audioUrl) URL.revokeObjectURL(media.audioUrl);
      media.audioUrl = URL.createObjectURL(file);
      state.audioName = file.name;
      audioEl.src = media.audioUrl;
      audioPreview.hidden = false;
      saveState();
    });
    $("#removeAudioBtn").addEventListener("click", () => {
      if (media.audioUrl) URL.revokeObjectURL(media.audioUrl);
      media.audioUrl = "";
      state.audioName = "";
      audioInput.value = "";
      audioEl.removeAttribute("src");
      audioPreview.hidden = true;
      saveState();
    });
  }
}
