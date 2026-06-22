// Gather all the HTML elements we need to manipulate
const searchForm = document.getElementById("search-form");
const dateInput = document.getElementById("date-input");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const apodResultSection = document.getElementById("apod-result");

const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodMediaBox = document.getElementById("apod-media-box");

const randomBtn = document.getElementById("random-btn");
const favoriteBtn = document.getElementById("favorite-btn");
const downloadBtn = document.getElementById("download-btn");

const favoritesTrack = document.getElementById("favorites-track");
const favoritesEmpty = document.getElementById("favorites-empty");

const FAVORITES_KEY = "caelum:favorites";

// Keeps a reference to whatever plate is currently on screen,
// so the favorite/download buttons know what they're acting on.
let currentPlate = null;

/**
 * Updates the web page UI with fresh data from the NASA API.
 */
function displaySpaceContent(data) {
  currentPlate = data;

  // fallback to "unknown title if NASA doesn't send one
  apodTitle.textContent = data.title || "Untitled Cosmic Phenomenon";
  apodDate.textContent = `Plate — ${data.date}`;
  apodExplanation.textContent =
    data.explanation || "No archival records avaiable for this celestial plate";
  apodCopyright.textContent = data.copyright
    ? `© ${data.copyright.trim()}`
    : "";

  apodMediaBox.innerHTML = "";

  if (data.media_type === "video") {
    // If it's a video, render an embedded video player frame
    apodMediaBox.innerHTML = `
            <iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:350px; min-height:320px; border-radius:2px;"></iframe>
        `;
  } else {
    // Otherwise, render a standard responsive image tag
    apodMediaBox.innerHTML = `
            <img id="apod-image" src="${data.url}" alt="${data.title}">
        `;
  }

  // 3. Make the result section visible on screen
  apodResultSection.classList.remove("hidden");

  // Wire the download button to the HD/original asset when available
  const hdUrl = data.hdurl || data.url;
  if (data.media_type === "video") {
    downloadBtn.classList.add("hidden");
  } else {
    downloadBtn.classList.remove("hidden");
    downloadBtn.href = hdUrl;
    downloadBtn.setAttribute(
      "download",
      `caelum-${data.date}-${slugify(data.title)}.jpg`,
    );
  }

  updateFavoriteButtonState();
}

/**
 * Shows an error message block to the user
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");

  //smooth scroll to the error message so the user sees it immediately
  errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Resets all visibility states before a brand new search begins
 */
function resetUIState() {
  errorMessage.classList.add("hidden");
  apodResultSection.classList.add("hidden");
}

/**
 * Toggles the loading animation text
 */
function toggleLoader(show) {
  loader.classList.toggle("hidden", !show);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------------- Favorites ---------------- */

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorited(date) {
  return getFavorites().some((entry) => entry.date === date);
}

function toggleFavorite() {
  if (!currentPlate) return;

  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(
    (entry) => entry.date === currentPlate.date,
  );

  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.unshift({
      date: currentPlate.date,
      title: currentPlate.title,
      url: currentPlate.url,
      media_type: currentPlate.media_type,
    });
  }

  saveFavorites(favorites);
  updateFavoriteButtonState();
  renderFavoritesRail();
}

function updateFavoriteButtonState() {
  if (!currentPlate) return;
  const saved = isFavorited(currentPlate.date);
  favoriteBtn.setAttribute("aria-pressed", saved ? "true" : "false");
  favoriteBtn.querySelector(".fav-icon").textContent = saved ? "♥" : "♡";
  favoriteBtn.lastChild.textContent = saved ? " Saved" : " Save plate";
}

function renderFavoritesRail() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    favoritesTrack.innerHTML = "";
    favoritesTrack.appendChild(favoritesEmpty);
    return;
  }

  favoritesTrack.innerHTML = favorites
    .map(
      (entry) => `
      <div class="rail-card" data-date="${entry.date}">
        <button class="rail-remove" data-remove="${entry.date}" aria-label="Remove ${entry.title}">×</button>
        ${
          entry.media_type === "video"
            ? `<div class="rail-date" style="height:90px;display:flex;align-items:center;justify-content:center;">▶</div>`
            : `<img src="${entry.url}" alt="${entry.title}" loading="lazy">`
        }
        <span class="rail-date">${entry.date}</span>
      </div>
    `,
    )
    .join("");
}
