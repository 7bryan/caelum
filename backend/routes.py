import os

from flask import Blueprint, jsonify, request
from services.nasa import fetch_apod_data

# blueprint to group API routes cleanly
api_bp = Blueprint("api", __name__)


@api_bp.route("/api/apod", method=["GET"])
def get_apod():
    # grab 'date' parameter is the frontend send one (e.g, /api/apod?date=2022-10-25)
    target_date = request.args.get("date")

    # securely pull the API KEY from the .env
    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        return jsonify(
            {"error": f"Server configuration error: Missing NASA API KEY."}
        ), 500

    # call the service function
    data, status_code = fetch_apod_data(api_key, target_date)

    # return the NASA data or error message stright to the frontend
    return jsonify(data), status_code
