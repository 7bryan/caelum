const BACKEND_URL = "http://127.0.0.1:5000/api/apod";

/**
 * Fetches NASA APOD data from local Python backend server.
 * @param {string} date - Optional date string formatted as YYYY-MM-DD
 * @returns {Promise<Object>} The JSON data containing the space image details
 */
async function fetchSpaceData(date = "") {
  // If a date is provided, build a URL like: http://127.0.0.1:5000/api/apod?date=2026-06-22
  let url = BACKEND_URL;
  if (date) {
    url += `?date=${date}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  // If the server returns a 400 or 500 error, pass the error message along
  if (!response.ok) {
    throw new Error(data.error || "An astronomical error occurred.");
  }

  return data;
}
