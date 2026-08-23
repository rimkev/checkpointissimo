# imports
from flask import Flask, render_template, request, make_response, session
from markupsafe import escape
from os import getenv

# initializing application
app = Flask(__name__, static_folder='templates/static')

# initializing session
session_key = getenv('SESSION_KEY')
if not session_key:
    raise RuntimeError('SESSION_KEY environment variable is required')
app.secret_key = session_key.encode('utf-8')

# homepage route
@app.route('/', methods=['GET'])
def homepage():
    return render_template('index.html')

# about page route
@app.route('/about', methods=['GET'])
def about_page():
    return render_template('about.html')

# sources page route
@app.route('/sources', methods=['GET'])
def sources_page():
    return render_template('sources.html')