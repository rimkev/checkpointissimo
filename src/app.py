# imports
from flask import Flask, render_template, request, make_response, session, jsonify
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

# sources page route
@app.route('/sources', methods=['GET'])
def sources_page():
    return render_template('sources.html')

# main program's page route
@app.route('/play', methods=['GET'])
def play_page():
    return render_template('play.html')

# getting cookie updates from javascript
@app.route('/write-cookie', methods=['POST'])
def write_cookie():
    # fetch message
    message = request.get_json()
    cookie_name = str(message['cookieName'])
    data = message['data']
    # override the described cookie with a new value
    session[cookie_name] = data
    return {'success': True}

# returning all session cookies
@app.route('/read-cookies', methods=['GET'])
def read_cookies():
    data = {
        'video_info': session.get('video_info', {}), # video_info = {'abc': 123.5, ...}; id and seconds
        'checkpoints': session.get('checkpoints', []) # checkpoints = [125, 135, ...]; seconds
    }
    return jsonify(data)
