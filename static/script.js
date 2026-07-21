const fileInput = document.getElementById("fileInput");

const preview = document.getElementById("preview");

const fileName = document.getElementById("fileName");

const dropArea = document.getElementById("dropArea");

const predictButton = document.getElementById("predictButton");



// ----------------------
// Image Preview
// ----------------------

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    fileName.textContent = file.name;

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;

        preview.style.display = "block";

        preview.classList.add("fade");

    };

    reader.readAsDataURL(file);

});



// ----------------------
// Drag Events
// ----------------------

dropArea.addEventListener("dragover", function (e) {

    e.preventDefault();

    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop", function (e) {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    fileInput.files = e.dataTransfer.files;

    fileInput.dispatchEvent(new Event("change"));

});



// ----------------------
// Loading Button
// ----------------------

document.querySelector("form").addEventListener("submit", function () {

    predictButton.innerHTML = "Predicting...";

    predictButton.disabled = true;

});