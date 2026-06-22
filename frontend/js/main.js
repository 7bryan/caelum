// Listen for when the form gets submitted (Retrieve plate button clicked)
searchForm.addEventListener("submit", async (event) => {
  // Prevent the web page from automatically refreshing on submit
  event.preventDefault();

  const selectedDate = dateInput.value;

  // 1. Clear old states and show the loader
  resetUIState();
  toggleLoader(true);

  try {
    // 2. Ask our api.js module to fetch data from our Python server
    const spaceData = await fetchSpaceData(selectedDate);

    // 3. Hand the data off to ui.js to inject into HTML
    displaySpaceContent(spaceData);
  } catch (error) {
    // Handle network connection failures or custom error messages from our Python backend
    showError(error.message);
  } finally {
    // 4. Always turn off the loading text when finished
    toggleLoader(false);
  }
});

// Random plate button
randomBtn.addEventListener("click", async () => {
  resetUIState();
  toggleLoader(true);

  try {
    const spaceData = await fetchRandomSpaceData();
    dateInput.value = spaceData.date;
    displaySpaceContent(spaceData);
  } catch (error) {
    showError(error.message);
  } finally {
    toggleLoader(false);
  }
});

// Save / unsave the currently displayed plate
favoriteBtn.addEventListener("click", () => {
  toggleFavorite();
});

// Clicking a saved plate in the rail re-loads it; clicking × removes it
favoritesTrack.addEventListener("click", async (event) => {
  const removeDate = event.target.getAttribute("data-remove");
  if (removeDate) {
    event.stopPropagation();
    const favorites = getFavorites().filter((f) => f.date !== removeDate);
    saveFavorites(favorites);
    renderFavoritesRail();
    if (currentPlate && currentPlate.date === removeDate) {
      updateFavoriteButtonState();
    }
    return;
  }

  const card = event.target.closest(".rail-card");
  if (!card) return;

  const date = card.getAttribute("data-date");
  resetUIState();
  toggleLoader(true);

  try {
    const spaceData = await fetchSpaceData(date);
    dateInput.value = date;
    displaySpaceContent(spaceData);
  } catch (error) {
    showError(error.message);
  } finally {
    toggleLoader(false);
  }
});

// Load today's plate and the saved favorites rail on first paint
window.addEventListener("DOMContentLoaded", async () => {
  renderFavoritesRail();

  toggleLoader(true);
  try {
    const todayData = await fetchSpaceData();
    dateInput.value = todayData.date;
    displaySpaceContent(todayData);
  } catch (error) {
    showError(
      "Could not load today's space image. Make sure the Flask server is running.",
    );
  } finally {
    toggleLoader(false);
  }
});
