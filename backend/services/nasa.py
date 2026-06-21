from datetime import datetime

import requests

# NASA APOD archieve started on June 16, 1995
NASA_MIN_DATE = datetime.strptime("1995-06-16", "%Y-%m-%d").date()


def fetch_apod_data(api_key, target_date_str=None):
    # fetch APOD from NASA
    # if the date is provided then fetch that specific date
    url = "https://api.nasa.gov/planetary/apod"
    params = {"api_key": api_key}

    # validate the specific date
    if target_date_str:
        try:
            target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()

            # check if that date is in the future
            if target_date > datetime.today().date():
                return {
                    "error": "The universe hasn't made that day yet! Please pick today or past date."
                }, 400

            # check if APOD not exist yet
            if target_date < NASA_MIN_DATE:
                return {
                    "error": "NASA's digital cameras weren't born yet. Please pick a date after June 16, 1995."
                }, 400

            # if target date is valid, add to the API Request paramenters
            params["date"] = target_date_str

        except ValueError:  # fix this later (make the frontend input to a calendar type, not string input)
            return {"error": "Invalid date format. Use DDDD-MM-DD."}, 400

    try:
        response = requests.get(url, params=params)

        # if NASA returns a bad error (e.g bad API KEY)
        if response.status_code != 200:
            return {f"error:NASA API error {response.reason}"}, response.status_code

        return response.json(), 200

    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to connect to NASA: {str(e)}"}, 500
