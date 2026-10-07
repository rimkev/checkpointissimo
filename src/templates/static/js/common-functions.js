/*
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
*/

import {state} from './state.js'

/**
 * Rewinds all videos to a synchronized position and applies autoplay state.
 * @param {number} seekingTime Target time in seconds.
 * @returns {void}
 */
export function rewind(seekingTime) {
    const headstart = 1 // seconds to go back earlier than user intends to
    if (!outOfSyncPossibility(seekingTime - headstart)) {
        if (state.videos.length !== 0) {
            state.videos.forEach(vid => {
                const timeDffFromFirstVid = vid.getCurrentTime().toFixed(1) - state.videos[0].getCurrentTime().toFixed(1);
                vid.seekTo(Number(seekingTime) + Number(timeDffFromFirstVid) - headstart, true)
            })
            if (!state.autoplay)
                stopAllVideos()
            else
                startAllVideos()
        }
    }
    else {
        alert('Timestamps are based on the very first video on the list. Going to this timestamp would make one or more videos out of sync with others, because they can only be rewinded back to 00:00:00.')
    }
}


/**
 * Checks whether rewinding would move any video before its start.
 * @param {number} seekingTime Target time in seconds.
 * @returns {boolean} Whether rewinding could desynchronize the videos.
 */
function outOfSyncPossibility(seekingTime) {
    if (state.videos.length !== 0) {
        for (const video of state.videos) {
            const timeDffFromFirstVid = video.getCurrentTime().toFixed(1) - state.videos[0].getCurrentTime().toFixed(1)
            if (Number(seekingTime) + Number(timeDffFromFirstVid) < 0)
                return true
        }
    }
    return false
}



/**
 * Reads all cookies from server.
 * @returns {Promise<Body.json>|null} JSON response or null if cookies were not sent
 */
export async function readCookies() {
    const resp = await fetch('/read-cookies', {
        method: 'GET'
    })
    if (resp.ok)
        return resp.json()
    return null
}


/**
 * Sends a cookie update request to the Flask application.
 * @param {string} cookieName Cookie key to update.
 * @param {*} data JSON-serializable cookie value.
 * @returns {void} Resolves when the request completes.
 */
export function writeCookie(cookieName, data) {
    fetch('/write-cookie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cookieName: cookieName,
            data: data
        })
    })
}




/**
 * Saves each video's current playback time to the session cookie.
 * @returns {void}
 */
export function writeVideoInfoCookie() {
    if (state.videos.length === 0)
        return

    let cookieData = {}
    for (const vid of state.videos)
        cookieData[vid.getVideoData().video_id] = vid.getCurrentTime().toFixed(1)
    writeCookie('video_info', cookieData)
}


/**
 * Pauses every video and updates the start/stop control.
 * @returns {void}
 */
export function stopAllVideos() {
    state.videos.forEach(vid => vid.pauseVideo())
    state.nowPlaying = false
    changeStartStopBtnAppearance()
}


/**
 * Waits for all players to be ready, then starts playback.
 * @returns {void}
 */
export function startAllVideos() {
    writeVideoInfoCookie()

    const whileLoop = setInterval(() => {
        if (state.uncuedVideoIds.length === 0) {
            state.videos.forEach(vid => vid.playVideo())
            state.nowPlaying = true
            changeStartStopBtnAppearance()
            clearInterval(whileLoop)
        }
    }, 100)
}


/**
 * Updates the start/stop button to reflect playback state.
 * @returns {void}
 */
export function changeStartStopBtnAppearance() {
    const button = document.getElementById('start-stop-button')

    if (state.nowPlaying)
        button.className = 'button-off'
    else
        button.className = 'button-on'

    const stateString = state.nowPlaying ? 'Stop' : 'Start'
    button.textContent = `${stateString} all videos`
}



/**
 * Finds the sorted insertion index for a timestamp.
 * @param {number} xTime Timestamp in seconds.
 * @returns {number} The index at which the timestamp belongs.
 */
export function getCheckpointIndexForInsertion(xTime) {
    for (let i = state.checkpoints.length - 1; i >= 0; i--) {
        if (state.checkpoints[i].getTimestamp() <= Number(xTime).toFixed(1))
            return i + 1
    }
    return 0
}