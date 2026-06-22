from datetime import datetime

import requests

# NASA APOD archive started on June 16, 1995
NASA_MIN_DATE = datetime.strptime("1995-06-16", "%Y-%m-%d").date()

# Simple in-memory cache dictionary to prevent redundant API hits
APOD_CACHE = {}


def fetch_apod_data(api_key, target_date_str=None):
    """Fetches APOD from NASA or serves it instantly from cache if requested before."""
    # If no date provided, default to today's string format
    if not target_date_str:
        target_date_str = datetime.today().date().strftime("%Y-%m-%d")

    url = "https://api.nasa.gov/planetary/apod"
    params = {"api_key": api_key}

    # --- 1. Check Cache First ---
    if target_date_str in APOD_CACHE:
        print(f"Cache Hit! Serving data for {target_date_str} instantly.")
        return APOD_CACHE[target_date_str], 200

    # --- 2. Validate Date Targets ---
    try:
        target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()

        if target_date > datetime.today().date():
            return {
                "error": "The universe hasn't made that day yet! Please pick today or a past date."
            }, 400

        if target_date < NASA_MIN_DATE:
            return {
                "error": "NASA's digital cameras weren't born yet. Please pick a date after June 16, 1995."
            }, 400

        params["date"] = target_date_str

    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

    # --- 3. Live External API Fetch ---
    try:
        print(
            f"Cache Miss. Sending live network request to NASA for {target_date_str}..."
        )
        response = requests.get(url, params=params)

        # if NASA returns a bad error (e.g bad API KEY)
        if response.status_code != 200:
            return {"error": f"NASA API error: {response.reason}"}, response.status_code

        response_data = response.json()

        # Save successful result to memory cache before returning
        APOD_CACHE[target_date_str] = response_data

        return response_data, 200

    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to connect to NASA: {str(e)}"}, 500
