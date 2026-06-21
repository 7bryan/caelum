import os

import requests
from dotenv import load_dotenv
from flask import Flask

# Automatically searches the current folder for a file named '.env'
load_dotenv()

# Now you can safely use your key
API_KEY = os.getenv("WEATHER_API_KEY")
