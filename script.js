const PASSWORD = "1218";
const ADD_NUM_A = 10;
const ADD_NUM_B = 8;

const screens = {
  pass: document.getElementById("screen-pass"),
  note: document.getElementById("screen-note"),
  choice: document.getElementById("screen-camera"),
  final: document.getElementById("screen-final"),
};

const toastEl = document.getElementById("toast");
const toastTitle = document.getElementById("toast-title");
const toastMsg = document.getElementById("toast-msg");
const toastImg = document.getElementById("toast-img");

const passForm = document.getElementById("pass-form");
const passInput = document.getElementById("pass-input");
const inviteBtn = document.getElementById("invite-btn");
const noteGif = document.getElementById("note-gif");

const decisionActions = document.getElementById("decision-actions");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

const choiceNote = document.getElementById("choice-note");

const additionBlock = document.getElementById("addition-block");
const addProblem = document.getElementById("add-problem");
const addForm = document.getElementById("add-form");
const addAnswer = document.getElementById("add-answer");
const addBack = document.getElementById("add-back");

const modalHard = document.getElementById("modal-hard");
const modalClose = document.getElementById("modal-close");

const finalVideo = document.getElementById("final-video");
const letterBtn = document.getElementById("letter-btn");
const letterModal = document.getElementById("letter-modal");
const letterClose = document.getElementById("letter-close");
const letterBackdrop = document.querySelector("#letter-modal .modal-backdrop");

let toastTimeout;
let letterButtonShown = false;

// Passcode gate
passForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = passInput.value.trim();
  if (value === PASSWORD) {
    showToast("success", "heyyy you are my loveyy", "come on in", "gif/gif-1.gif");
    passInput.value = "";
    setTimeout(() => switchScreen("note"), 550);
  } else {
    showToast("error", "Oops! wrong code", "Try the date: month + day.", "gif/gif-2.gif");
    passInput.classList.add("invalid");
    setTimeout(() => passInput.classList.remove("invalid"), 380);
  }
});

// Flow entry
inviteBtn.addEventListener("click", startChoiceFlow);
noteGif.addEventListener("click", startChoiceFlow);

function startChoiceFlow() {
  switchScreen("choice");
  setChoiceNote("Choose yes or no to continue.");
  hideAddition();
  closeModal();
}

// Choice buttons
yesBtn.addEventListener("click", () => {
  setChoiceNote("Solve this quick one:");
  decisionActions.classList.add("hidden");
  additionBlock.classList.remove("hidden");
  addProblem.textContent = `Solve: ${ADD_NUM_A} + ${ADD_NUM_B} = ?`;
  addAnswer.value = "";
  addAnswer.focus();
});

noBtn.addEventListener("click", () => {
  setChoiceNote("Are you sure about that?");
  openModal();
});

// Addition form
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const expected = ADD_NUM_A + ADD_NUM_B;
  const answer = Number(addAnswer.value);
  if (Number.isFinite(answer) && answer === expected) {
    setChoiceNote("Great job! Let's go.");
    showToast("success", "Math genius!", "You unlocked the surprise.", "gif/gif-1.gif");
    setTimeout(() => {
      switchScreen("final");
      ensureVideoPlays();
    }, 650);
  } else {
    setChoiceNote("Not quite - try once more!");
    showToast("error", "Not quite", "Try that addition once more.", "gif/gif-2.gif");
    addAnswer.focus();
  }
});

addBack.addEventListener("click", hideAddition);

function hideAddition() {
  decisionActions.classList.remove("hidden");
  additionBlock.classList.add("hidden");
  addAnswer.value = "";
  setChoiceNote("Choose yes or no to continue.");
}

// Modal
function openModal() {
  modalHard.classList.remove("hidden");
}

function closeModal() {
  modalHard.classList.add("hidden");
}

modalClose.addEventListener("click", () => {
  closeModal();
  setChoiceNote("Maybe give yes a try?");
});

// Final video and letter
if (finalVideo) {
  finalVideo.addEventListener("play", () => {
    closeLetterModal();
    hideLetterButton();
  });
  finalVideo.addEventListener("timeupdate", () => {
    if (letterButtonShown) return;
    if (finalVideo.duration && finalVideo.currentTime / finalVideo.duration >= 0.98) {
      revealLetterButton();
      letterButtonShown = true;
    }
  });
}

if (letterBtn) {
  letterBtn.addEventListener("click", openLetterModal);
}

if (letterClose) {
  letterClose.addEventListener("click", closeLetterModal);
}

if (letterBackdrop) {
  letterBackdrop.addEventListener("click", closeLetterModal);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLetterModal();
  }
});

async function ensureVideoPlays() {
  if (!finalVideo) return;
  try {
    finalVideo.pause();
    finalVideo.currentTime = 0;
    finalVideo.muted = false;
    finalVideo.volume = 1;
    finalVideo.loop = true;
    finalVideo.playsInline = true;
    finalVideo.autoplay = true;
    finalVideo.controls = true;
    letterButtonShown = false;
    hideLetterButton();
    closeLetterModal();
    finalVideo.load();
    await finalVideo.play();
  } catch (err) {
    // Autoplay blocked; show controls and poster remains
    console.warn("Autoplay blocked, user interaction needed:", err);
  }
}

// Helpers
function switchScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  const target = screens[name];
  if (target) target.classList.add("active");
}

function showToast(type, title, message, imgUrl) {
  const fallback = type === "error" ? "gif/gif-2.gif" : "gif/gif-1.gif";
  toastImg.style.backgroundImage = `url('${imgUrl || fallback}')`;
  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toastEl.classList.remove("hidden");
  toastEl.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("visible");
    setTimeout(() => toastEl.classList.add("hidden"), 400);
  }, 3200);
}

function setChoiceNote(text) {
  if (choiceNote) choiceNote.textContent = text;
}

function revealLetterButton() {
  if (letterBtn) {
    letterBtn.classList.remove("hidden");
  }
}

function hideLetterButton() {
  if (letterBtn) {
    letterBtn.classList.add("hidden");
  }
}

function openLetterModal() {
  if (letterModal) {
    letterModal.classList.remove("hidden");
  }
}

function closeLetterModal() {
  if (letterModal) {
    letterModal.classList.add("hidden");
  }
}
