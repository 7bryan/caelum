// Gather all the HTML elements we need to manipulate
const searchForm = document.getElementById("search-form");
const dateInput = document.getElementById("date-input");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const apodResultSection = document.getElementById("apod-result");

const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodExplanation = document.getElementById("apod-explanation");
const apodMediaBox = document.getElementById("apod-media-box");

/**
 * Updates the web page UI with fresh data from the NASA API.
 */
function displaySpaceContent(data) {
  // 1. Set the Title, Date, and Explanation text
  apodTitle.textContent = data.title;
  apodDate.textContent = data.date;
  apodExplanation.textContent = data.explanation;

  // 2. Handle NASA's "media_type" quirk (Images vs Videos/YouTube links)
  apodMediaBox.innerHTML = ""; // Clear anything currently in the box

  if (data.media_type === "video") {
    // If it's a video, render an embedded video player frame
    apodMediaBox.innerHTML = `
            <iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:350px; border-radius:8px;"></iframe>
        `;
  } else {
    // Otherwise, render a standard responsive image tag
    apodMediaBox.innerHTML = `
            <img src="${data.url}" alt="${data.title}" style="width:100%; height:auto; border-radius:8px;">
        `;
  }

  // 3. Make the result section visible on screen
  apodResultSection.classList.remove("hidden");
}

/**
 * Shows an error message block to the user
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
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
  if (show) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
}
