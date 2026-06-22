// Listen for when the form gets submitted (Explore Space button clicked)
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

// Bonus: Automatically trigger a blank search when the page loads so the user sees today's current image immediately!
window.addEventListener("DOMContentLoaded", async () => {
  toggleLoader(true);
  try {
    const todayData = await fetchSpaceData();
    displaySpaceContent(todayData);
  } catch (error) {
    showError(
      "Could not load today's space image. Ensure your Flask server is running!",
    );
  } finally {
    toggleLoader(false);
  }
});
