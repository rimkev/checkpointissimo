import * as cpfuncs from './checkpoint-functions.js'
import * as common from './common-functions.js'
import {state} from './state.js'

// getting session cookies and asking user whether to load from previous session
readAndInterpretSessionCookies()


// author's signature disappears to leave space for the user
window.addEventListener('mousemove', () => {
    setTimeout(() => {
        const footer = document.getElementById('signature-footer')
        footer.hidden = true;
    }, 5_000)
})



// ADDING VIDEO
// button click action
document.getElementById('add-video-button').onclick = function() {
    const videoId = getVideoId()
    if (videoId !== -1) {
        createVideo(videoId)
        enableButtons()
    }
    else
        alert('Invalid Youtube link. Cannot import such video.')
}



/**
 * Extracts a YouTube video ID from a supported video URL.
 * @returns {string} The video ID, or -1 when the URL is invalid.
 */
function getVideoId() {
    // prompt user
    const wholeLink = prompt('Enter a Youtube video link: ')

    // extracting
    let returnable = -1
    if (wholeLink.includes('youtube.com')) {
        if (wholeLink.includes('&list=')) {
            returnable = wholeLink.split('/watch?v=')[1].split('&list=')[0]
        } else {
            returnable = wholeLink.split('/watch?v=')[1]
        }
    } else if (wholeLink.includes('youtu.be')) {
        returnable = wholeLink.split('youtu.be/')[1].split('?si=')[0]
    }
    return returnable
}



/**
 * Creates a YouTube player and adds it to shared playback state.
 * @param {string} videoId YouTube video ID.
 * @param {number} startingTime Optional initial playback time.
 * @returns {void}
 */
function createVideo(videoId, startingTime=null) {
    // create new div, which gets replaced by Youtube's iFrame
    const newDiv = document.createElement('div')
    newDiv.className = 'yt-video'
    // append it to the screen
    document.getElementById('video-playback-section').append(newDiv)
    // create the video iFrame
    const iFrameObj = createVideoIFrame(newDiv, videoId, startingTime)
    // push onto a list of all videos
    state.videos.push(iFrameObj)
}



/**
 * Creates a YouTube IFrame player for a video element.
 * @param {HTMLElement} element Element replaced by the YouTube player.
 * @param {string} videoId YouTube video ID.
 * @param {number} startingTime Optional initial playback time.
 * @returns {YT.Player} The created YouTube player.
 */
function createVideoIFrame(element, videoId, startingTime) {
    return new YT.Player(element, {
        videoId: videoId,
        playerVars: {
            playsinline: 1,
            origin: window.location.origin,
        },
        height: '300',
        width: '100%',
        events: {
            onReady: (event) => {
                // setting to a specific starting time if needed
                if (startingTime !== null)
                    event.target.seekTo(Number(startingTime), true)
                    event.target.pauseVideo()
                // removing video's id from uncued video ids array
                const pendingIndex = state.uncuedVideoIds.indexOf(videoId)
                if (pendingIndex !== -1)
                    state.uncuedVideoIds.splice(pendingIndex, 1)
                // update cookie
                common.writeVideoInfoCookie()
            },
            onError: (event) => {
                // removing the video player due to error after a delay to finish uploading first
                setTimeout( () => {
                    removeLastVideo()
                }, 300)
                if (Number(event.data) === 150)
                    alert(`Cannot import this video because either video creators restricted embedded access to it or Youtube is not convinced you are not a bot.`)
                else
                    alert(`YouTube player error ${event.data}. Video cannot be imported.`)
            },
            'onStateChange': (event) => {
                // PURPOSEFULLY COMMENTED OUT -> NOW EASIER TO GET CORRECT INITIAL TIMING FOR ALL VIDEOS
                // stop or start all videos when interacted with individually to prevent out of sync situation
                // if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                //     stopAllVideos()
                // }
                // else if (event.data === YT.PlayerState.PLAYING) {
                //     startAllVideos()
                // }
            }
        },
    })
}



/**
 * Enables controls that require at least one video.
 * @returns {void}
 */
function enableButtons() {
    // enabling buttons
    document.getElementById('start-stop-button').disabled = false
    document.getElementById('add-checkpoint-button').disabled = false
    document.getElementById('remove-video-button').disabled = false
}







// VIDEO REMOVAL
// button click action
document.getElementById('remove-video-button').onclick = function() {
    // remove last video
    removeLastVideo()
}



/**
 * Removes the last video and updates related state and controls.
 * @returns {void}
 */
function removeLastVideo() {
    if (state.videos.length !== 0) {
        const lastVideo = state.videos[state.videos.length - 1]
        const videoId = lastVideo.getVideoData().video_id
        // destroying video player from DOM
        lastVideo.destroy()
        // removing from videos list
        state.videos.pop()
        // removing from uncued videos list
        if (state.uncuedVideoIds.includes(videoId))
            state.uncuedVideoIds.splice(state.uncuedVideoIds.indexOf(videoId), 1)
        // if all videos were deleted
        if (state.videos.length === 0)
            reset()
        // update cookie
        common.writeVideoInfoCookie()
    }
    else
        alert('Video list is already empty.')
}



/**
 * Clears checkpoints and disables controls that require videos.
 * @returns {void}
 */
function reset() {
    // removing all checkpoints 
    document.getElementById('checkpoint-section').replaceChildren()
    state.checkpoints.length = 0

    // resetting play/pause button
    state.nowPlaying = false
    common.changeStartStopBtnAppearance()

    // disabling buttons
    document.getElementById('start-stop-button').disabled = true
    document.getElementById('jump-button').disabled = true
    document.getElementById('add-checkpoint-button').disabled = true
    document.getElementById('remove-video-button').disabled = true
}








// AUTOPLAY BUTTON
// button click action
document.getElementById('autoplay-button').onclick = function() {
    state.autoplay = !state.autoplay
    changeAutoplayBtnAppearance()
}



/**
 * Updates the autoplay button to reflect its current state.
 * @returns {void}
 */
function changeAutoplayBtnAppearance() {
    const button = document.getElementById('autoplay-button')

    if (state.autoplay)
        button.className = 'button-on'
    else
        button.className = 'button-off'

    const stateString = state.autoplay ? 'on' : 'off'
    button.textContent = `Autoplay toggle (${stateString})`
}






// START/STOP BUTTON
// button action
document.getElementById('start-stop-button').onclick = function() {
    if (state.videos.length === 0)
        return

    if (state.nowPlaying) // have to stop
        common.stopAllVideos()
    else // have to start
        common.startAllVideos()
}





// ADDING CHECKPOINTS
// button action
document.getElementById('add-checkpoint-button').onclick = function() {
    if (state.videos.length === 0)
        return

    const timeSec = state.videos[0].getCurrentTime().toFixed(1)
    // if already exists
    if (state.checkpoints.map(cp => cp.getTimestamp()).includes(Number(timeSec))) {
        alert('Checkpoint at this timestamp already exists.')
        return
    }
    // create checkpoint
    cpfuncs.createCheckpoint(timeSec)
    
    // enabling jump button only when there is at least one checkpoint
    document.getElementById('jump-button').disabled = false
}





// GETTING BACK TO THE LAST CHECKPOINT BEHIND CURRENT TIME
// button click action
document.getElementById('jump-button').onclick = function() {
    if (state.videos.length === 0 || state.checkpoints.length === 0)
        return

    // keep in mind - getCheckpointIndexForInsertion produces the index after the item it stopped checking last
    const lastCheckpointI = common.getCheckpointIndexForInsertion(state.videos[0].getCurrentTime())
    if (lastCheckpointI !== 0) {
        const lastTime = state.checkpoints[lastCheckpointI - 1].getTimestamp()
        common.rewind(lastTime)
    }
    else
        alert('Cannot go to previous checkpoint.')
}


/**
 * Restores saved videos and checkpoints after user confirmation.
 * @param {Record<string, number>} sessionVideoInfo Video IDs mapped to saved times.
 * @param {number[]} sessionCheckpoints Saved checkpoint timestamps.
 * @returns {void}
 */
function interpretSessionCookies(sessionVideoInfo, sessionCheckpoints) {
    if (Object.keys(sessionVideoInfo).length === 0)
        return

    // ask whether or not to load data from cookies
    const answer = confirm('Video(s) were found from your previous session. Would you like to load them now?\nPress \'Ok\' to load.\nPress \'Cancel\' to lose them irreversibly.')
    if (!answer) {
        common.writeCookie('checkpoints', [])
        common.writeCookie('video_info', {})
        state.checkpoints = []
        state.videos = []
        return
    }

    // dealing with videos
    for (const [id, time] of Object.entries(sessionVideoInfo)) {
        createVideo(id, Number(time))
    }
    enableButtons()

    // dealing with checkpoints
    if (sessionCheckpoints.length === 0)
        return
    for (const timeSec of sessionCheckpoints) {
        cpfuncs.createCheckpoint(timeSec)
    }
    document.getElementById('jump-button').disabled = false
}

/**
 * Tries to read and interpret cookies from server. Called at the start once to offer user to load previous session
 * @returns {void}
 */
function readAndInterpretSessionCookies() {
    const resp = common.readCookies()
    // handling the promise. resp doesn't contain the data itself, but a promise to get it. So we have to wait for it to resolve and then interpret the data.
    if (resp !== null)
        resp.then((data) => interpretSessionCookies(data.video_info, data.checkpoints), null)
}
