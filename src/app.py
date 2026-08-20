# imports
from flask import Flask, render_template, request, make_response, session
from markupsafe import escape
from os import getenv

# initializing application
app = Flask(__name__)

# initializing session
session_key = getenv('SESSION_KEY')
if not session_key:
    raise RuntimeError('SESSION_KEY environment variable is required')
app.secret_key = session_key.encode('utf-8')

# homepage route
@app.route('/', methods=['GET'])
def homepage():
    return render_template('index.html')