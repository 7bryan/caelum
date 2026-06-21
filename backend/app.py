import os

import requests
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import api_bp

# load environment variable from the .env
load_dotenv()

app = Flask(__name__)

# CORS (Cross-Origin Resource Sharing)
# Telling python to allow js frontend to talk to this backend
CORS(app)


# simple check route, making sure the backend is alive
@app.route("/")
def home():
    return {"message": "Welcome to Caelum Backend Server"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
