const BACKEND_URL = "http://127.0.0.1:5000/api/apod";

const APOD_MIN_DATE = "1995-06-16";

/**
 * Fetches NASA APOD data from the local Flask backend.
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

/**
 * Picks a random valid date between the APOD archive's start date and today,
 * then fetches that plate.
 */
async function fetchRandomSpaceData() {
  const start = new Date(APOD_MIN_DATE).getTime();
  const end = Date.now();
  const randomTime = start + Math.random() * (end - start);
  const randomDate = new Date(randomTime).toISOString().slice(0, 10);
  return fetchSpaceData(randomDate);
}
