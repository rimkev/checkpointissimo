'''
Copyright (C) 2026 Rimantas Rimkevičius

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see https://www.gnu.org/licenses/
'''

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
