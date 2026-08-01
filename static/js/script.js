/* ==========================================================
   Brain Tumor MRI Classifier — Vanilla JS
   Handles: drag & drop, image preview, validation,
   loading overlay, animated probability bars.
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Constants ---------- */
  var MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  var ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];
  var ALLOWED_MIME = ["image/jpeg", "image/png"];
  var STORAGE_KEY = "mri-preview-data-url";

  var LOADING_MESSAGES = [
    "Analyzing MRI…",
    "Extracting Features…",
    "Running CNN…",
    "Predicting Tumor Type…",
    "Almost Done…"
  ];

  /* ---------- DOM refs ---------- */
  var dropZone = document.getElementById("dropZone");
  var fileInput = document.getElementById("fileInput");
  var browseBtn = document.getElementById("browseBtn");
  var filePreview = document.getElementById("filePreview");
  var previewImage = document.getElementById("previewImage");
  var fileNameEl = document.getElementById("fileName");
  var fileSizeEl = document.getElementById("fileSize");
  var removeFileBtn = document.getElementById("removeFile");
  var uploadProgress = document.getElementById("uploadProgress");
  var analyzeBtn = document.getElementById("analyzeBtn");
  var uploadForm = document.getElementById("uploadForm");
  var formError = document.getElementById("formError");

  var loadingOverlay = document.getElementById("loadingOverlay");
  var loadingMessage = document.getElementById("loadingMessage");
  var loadingProgressBar = document.getElementById("loadingProgressBar");
  var loadingPercent = document.getElementById("loadingPercent");

  var messageTimer = null;
  var progressTimer = null;

  /* ==========================================================
     Helpers
     ========================================================== */
  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = false;
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.hidden = true;
  }

  function setAnalyzeEnabled(enabled) {
    if (!analyzeBtn) return;
    analyzeBtn.disabled = !enabled;
    analyzeBtn.setAttribute("aria-disabled", String(!enabled));
  }

  /* Robust show/hide that flips BOTH the `hidden` attribute
     AND the `is-hidden` class — no more zombie previews. */
  function showEl(el) {
    if (!el) return;
    el.hidden = false;
    el.classList.remove("is-hidden");
  }
  function hideEl(el) {
    if (!el) return;
    el.hidden = true;
    el.classList.add("is-hidden");
  }

  /* ==========================================================
     File selection & validation
     ========================================================== */
  function validateFile(file) {
    var ext = (file.name.split(".").pop() || "").toLowerCase();
    if (ALLOWED_EXTENSIONS.indexOf(ext) === -1 && ALLOWED_MIME.indexOf(file.type) === -1) {
      return "Invalid file type. Please upload a JPG, JPEG or PNG image.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large (" + formatBytes(file.size) + "). Maximum size is 10 MB.";
    }
    return null;
  }

  function handleFile(file) {
    clearError();
    if (!file) return;

    var error = validateFile(file);
    if (error) {
      resetSelection();
      showError(error);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var dataUrl = e.target.result;
      previewImage.src = dataUrl;
      previewImage.alt = "Preview of selected MRI scan: " + file.name;

      try { sessionStorage.setItem(STORAGE_KEY, dataUrl); } catch (err) {}

      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = formatBytes(file.size);
      showEl(filePreview);          // FIX: removes both hidden attr AND is-hidden class
      // Do NOT start the fake "upload progress" bar here — the file
      // is already in the browser; nothing is actually uploading yet.
      // We only visually mark progress when the form is submitted.
      setAnalyzeEnabled(true);
      analyzeBtn.focus();
    };
    reader.readAsDataURL(file);
  }

  function resetSelection() {
    if (fileInput) fileInput.value = "";
    if (previewImage) {
      previewImage.removeAttribute("src");
      previewImage.alt = "";
    }
    hideEl(filePreview);            // FIX: hides remove button + preview + progress reliably
    if (uploadProgress) {
      uploadProgress.classList.remove("upload-progress--active");
      uploadProgress.setAttribute("aria-hidden", "true");
    }
    if (fileNameEl) fileNameEl.textContent = "—";
    if (fileSizeEl) fileSizeEl.textContent = "";
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (err) {}
    setAnalyzeEnabled(false);
    clearError();
  }

  function startUploadProgress() {
    if (!uploadProgress) return;
    uploadProgress.classList.add("upload-progress--active");
    uploadProgress.setAttribute("aria-hidden", "false");
  }

  /* ==========================================================
     Drag & Drop + Browse
     ========================================================== */
  function initUpload() {
    if (!dropZone || !fileInput) return;

    browseBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });

    dropZone.addEventListener("click", function (e) {
      if (e.target !== browseBtn) fileInput.click();
    });

    dropZone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", function () {
      handleFile(fileInput.files[0]);
    });

    ["dragenter", "dragover"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add("drop-zone--active");
      });
    });

    ["dragleave", "drop"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("drop-zone--active");
      });
    });

    dropZone.addEventListener("drop", function (e) {
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      try {
        var dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      } catch (err) {}
      handleFile(file);
    });

    if (removeFileBtn) {
      removeFileBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        resetSelection();
        dropZone.focus();
      });
    }
  }

  /* ==========================================================
     Loading overlay
     ========================================================== */
  function startLoading() {
    if (!loadingOverlay) return;
    showEl(loadingOverlay);
    document.body.style.overflow = "hidden";
    // mark the upload-progress bar as active only now (submission moment)
    startUploadProgress();

    var msgIndex = 0;
    var progress = 0;

    loadingMessage.textContent = LOADING_MESSAGES[0];
    loadingProgressBar.style.width = "0%";
    loadingPercent.textContent = "0%";

    messageTimer = setInterval(function () {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      loadingMessage.classList.add("loading-message--swap");
      setTimeout(function () {
        loadingMessage.textContent = LOADING_MESSAGES[msgIndex];
        loadingMessage.classList.remove("loading-message--swap");
      }, 320);
    }, 2400);

    progressTimer = setInterval(function () {
      var remaining = 92 - progress;
      progress += Math.max(0.4, remaining * 0.06);
      progress = Math.min(progress, 92);
      loadingProgressBar.style.width = progress.toFixed(1) + "%";
      loadingPercent.textContent = Math.round(progress) + "%";
    }, 120);
  }

  /* NEW: proper teardown so the overlay never lingers. */
  function stopLoading() {
    if (messageTimer) { clearInterval(messageTimer); messageTimer = null; }
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    hideEl(loadingOverlay);
    document.body.style.overflow = "";
    if (loadingProgressBar) loadingProgressBar.style.width = "0%";
    if (loadingPercent) loadingPercent.textContent = "0%";
  }

  function initForm() {
    if (!uploadForm) return;

    uploadForm.addEventListener("submit", function (e) {
      if (!fileInput.files || !fileInput.files.length) {
        e.preventDefault();
        showError("Please select an MRI image before analyzing.");
        return;
      }
      var error = validateFile(fileInput.files[0]);
      if (error) {
        e.preventDefault();
        showError(error);
        return;
      }

      var results = document.getElementById("results");
      if (results) results.style.display = "none";

      setAnalyzeEnabled(false);
      startLoading();
    });
  }

  /* ==========================================================
     Result page: animated bars + restored MRI preview
     ========================================================== */
  function initResults() {
    var resultsSection = document.querySelector("[data-has-result]");
    if (!resultsSection) return;

    // FIX: If we land on a page that already has a prediction, the server
    // has responded — kill the loader immediately.
    stopLoading();

    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

    var mriImg = document.getElementById("resultMriImage");
    if (mriImg && !mriImg.getAttribute("src")) {
      try {
        var stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) mriImg.src = stored;
      } catch (err) {}
    }

    var fills = resultsSection.querySelectorAll(".prob-fill");
    setTimeout(function () {
      fills.forEach(function (fill) {
        var pct = parseFloat(fill.getAttribute("data-percent")) || 0;
        fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
      });
    }, 250);

    var confEl = document.getElementById("confidenceValue");
    if (confEl) {
      var target = parseFloat(confEl.getAttribute("data-percent")) || 0;
      var start = null;
      var duration = 1200;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        confEl.textContent = (target * eased).toFixed(1) + "%";
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* ==========================================================
     Boot
     ========================================================== */
  function init() {
    // FIX: force a clean initial state — kills any browser-restored preview,
    // any leftover "Remove" button visibility, and any stuck loading overlay.
    hideEl(filePreview);
    hideEl(loadingOverlay);
    if (uploadProgress) uploadProgress.classList.remove("upload-progress--active");
    if (fileInput) fileInput.value = "";
    setAnalyzeEnabled(false);

    initUpload();
    initForm();
    initResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // FIX: hide the loader when returning via bfcache OR any pageshow event.
  window.addEventListener("pageshow", function () {
    stopLoading();
    // Also re-assert a clean upload UI on back-navigation
    hideEl(filePreview);
    if (fileInput) fileInput.value = "";
    setAnalyzeEnabled(false);
  });
})();
