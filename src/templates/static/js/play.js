// author's signature disappears to leave space for the user
window.addEventListener('mousemove', () => {
    setTimeout(() => {
        const footer = document.getElementById('signature-footer')
        footer.hidden = true;
    }, 5_000)
})





// ADDING VIDEO
var allVideos = {
    'videoObjects': [],
    'uncuedVideoIds': []
}

// button click action
document.getElementById('add-video-button').onclick = function() {
    const videoId = getVideoId()
    if (videoId !== -1) {
        createVideo(videoId, allVideos)
        enableButtons()
    }
    else
        alert('Invalid Youtube link. Cannot import such video.')
}
// prompting the user for video id
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
// creating the necessary video div element and calling another function to turn it into IFrame
function createVideo(videoId, videoList, startingTime=null) {
    // create new div, which gets replaced by Youtube's iFrame
    const newDiv = document.createElement('div')
    newDiv.className = 'yt-video'
    // append it to the screen
    document.getElementById('video-playback-section').append(newDiv)
    // create the video iFrame
    const iFrameObj = createVideoIFrame(newDiv, videoId, videoList, startingTime)
    // push onto a list of all videos
    videoList['videoObjects'].push(iFrameObj)
}
// creating a Youtube IFrame out of a div element
function createVideoIFrame(element, videoId, videoList, startingTime) {
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
                const pendingIndex = videoList['uncuedVideoIds'].indexOf(videoId)
                if (pendingIndex !== -1)
                    videoList['uncuedVideoIds'].splice(pendingIndex, 1)
                // update cookie
                updateVideoInfoCookie(videoList)
            },
            onError: (event) => {
                // removing the video player due to error after a delay to finish uploading first
                setTimeout(() => {
                    removeLastVideo(videoList, checkpoints)
                }, 300)
                alert(`YouTube player error ${event.data}. Video cannot be included.`)
            },
            'onStateChange': (event) => {
                // PURPOSEFULLY COMMENTED OUT -> NOW EASIER TO GET CORRECT INITIAL TIMING FOR ALL VIDEOS
                // stop or start all videos when interacted with individually to prevent out of sync situation
                // if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                //     stopAllVideos(videoList)
                // }
                // else if (event.data === YT.PlayerState.PLAYING) {
                //     startAllVideos(videoList)
                // }
            }
        },
    })
}
// enabling buttons when a video is added
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
    removeLastVideo(allVideos, checkpoints)
}
// removing last video from the list
function removeLastVideo(videoList, checkpointList) {
    const videoElements = document.getElementsByClassName('yt-video')

    if (videoElements.length !== 0) {
        const lastVid = videoElements[videoElements.length - 1]
        const videoId = lastVid.getVideoData().video_id
        // remove
        lastVid.remove()
        videoList.pop()
        // removing from uncued videos list
        if (videoList['uncuedVideoIds'].includes(videoId))
            videoList['uncuedVideoIds'].splice(videoList['uncuedVideoIds'].indexOf(videoId))
        // if all videos were deleted
        if (videoList['videoObjects'].length === 0)
            reset(checkpointList)
        // update cookie
        updateVideoInfoCookie(videoList)
    }
    else
        alert('Video list is already empty.')
}
// reset values
function reset(checkpointList) {
    // removing all checkpoints 
    document.getElementById('checkpoint-section').replaceChildren()
    checkpointList = []

    // resetting play/pause button
    nowPlaying = false
    changeStartStopBtnAppearance()

    // disabling buttons
    document.getElementById('start-stop-button').disabled = true
    document.getElementById('jump-button').disabled = true
    document.getElementById('add-checkpoint-button').disabled = true
    document.getElementById('remove-video-button').disabled = true
}








// AUTOPLAY BUTTON
var autoplayState = true
// button click action
document.getElementById('autoplay-button').onclick = function() {
    autoplayState = !autoplayState
    changeAutoplayBtnAppearance()
}
// changing the button's color and text
function changeAutoplayBtnAppearance() {
    const button = document.getElementById('autoplay-button')

    if (autoplayState)
        button.className = 'button-on'
    else
        button.className = 'button-off'

    const stateString = autoplayState ? 'on' : 'off'
    button.textContent = `Autoplay toggle (${stateString})`
}






// START/STOP BUTTON
var nowPlaying = false
// button action
document.getElementById('start-stop-button').onclick = function() {
    if (allVideos['videoObjects'].length === 0)
        return

    if (nowPlaying) // have to stop
        stopAllVideos(allVideos)
    else // have to start
        startAllVideos(allVideos)
}
// stop all videos
function stopAllVideos(videoList) {
    // pause
    videoList['videoObjects'].forEach(vid => vid.pauseVideo())
    // change start/stop button appearance
    nowPlaying = false
    changeStartStopBtnAppearance()
}
// start all videos
function startAllVideos(videoList) {
    // update video_info cookie (for timestamp updates)
    updateVideoInfoCookie(videoList)
    
    // make sure all videos are ready to play (buffered)
    const whileLoop = setInterval(() => {
        if (videoList['uncuedVideoIds'].length === 0) { // if no videos are left uncued
            // play
            videoList['videoObjects'].forEach(vid => vid.playVideo())
            // change start/stop button appearance
            nowPlaying = true
            changeStartStopBtnAppearance()
            // stop this while loop
            clearInterval(whileLoop)
        }
    }, 100)
}
// changing the button's color and text
function changeStartStopBtnAppearance() {
    const button = document.getElementById('start-stop-button')

    if (nowPlaying)
        button.className = 'button-off'
    else
        button.className = 'button-on'

    const stateString = nowPlaying ? 'Stop' : 'Start'
    button.textContent = `${stateString} all videos`
}





// ADDING CHECKPOINTS
var checkpoints = []
// button action
document.getElementById('add-checkpoint-button').onclick = function() {
    if (allVideos['videoObjects'].length === 0)
        return

    // create checkpoint
    const timeSec = allVideos['videoObjects'][0].getCurrentTime().toFixed(1)
    createCheckpoint(timeSec, checkpoints, allVideos)
    
    // enabling jump button only when there is at least one checkpoint
    document.getElementById('jump-button').disabled = false
}
// create a new checkpoint
function createCheckpoint(timeSec, checkpointList, videoList) {
    if (videoList['videoObjects'].length === 0)
        return

    // new CP
    const newCP = document.createElement('a')
    newCP.textContent = getTextFromSec(timeSec)
    newCP.href = `#${timeSec}`
    newCP.addEventListener('click', function(event) {
        event.preventDefault()
        rewind(videoList, timeSec)
    })

    // add to list and section; update cookie
    document.getElementById('checkpoint-section').append(newCP)
    checkpointList.push(newCP)
    updateCookie('checkpoints', checkpointList.map(cp => Number(cp.href.split('#')[1])))
}
// generate text representation of seconds
function getTextFromSec(timeSec) {
    const date = new Date(timeSec * 1000)
    return `${date.toISOString().slice(11, 19)}${(timeSec % 1).toFixed(1).substring(1)}`
}
// find out whether any videos cannot go further back (would sync out of the group)
function outOfSyncPossibility(videoList, seekingTime) {
    if (videoList['videoObjects'].length !== 0) {
        for (let video of videoList['videoObjects']) {
            const timeDffFromFirstVid = video.getCurrentTime().toFixed(1) - videoList['videoObjects'][0].getCurrentTime().toFixed(1)
            if (Number(seekingTime) + Number(timeDffFromFirstVid) < 0)
                return true
        }
    }
    return false
}
// rewind
function rewind(videoList, seekingTime) {
    const headstart = 1 // seconds to go back earlier than user intends to
    if (!outOfSyncPossibility(videoList, seekingTime - headstart)) {
        if (videoList['videoObjects'].length !== 0) {
            videoList['videoObjects'].forEach(vid => {
                const timeDffFromFirstVid = vid.getCurrentTime().toFixed(1) - videoList['videoObjects'][0].getCurrentTime().toFixed(1);
                vid.seekTo(Number(seekingTime) + Number(timeDffFromFirstVid) - headstart, true)
            })
            if (!autoplayState)
                stopAllVideos(videoList)
            else
                startAllVideos(videoList)
        }
    }
    else {
        alert('Timestamps are based on the very first video on the list. Going to this timestamp would make one or more videos out of sync with others, because they can only be rewinded back to 00:00:00.')
    }
}





// GETTING BACK TO THE LAST CHECKPOINT BEHIND CURRENT TIME
// button click action
document.getElementById('jump-button').onclick = function() {
    if (allVideos['videoObjects'].length === 0 || checkpoints.length === 0)
        return

    const lastTime = lastVisitedCPTime(checkpoints, allVideos['videoObjects'][0].getCurrentTime().toFixed(1))
    if (lastTime !== -1)
        rewind(allVideos, lastTime)
    else
        alert('Cannot go to previous checkpoint.')
}
// get the last visited checkpoint time
function lastVisitedCPTime(checkpointList, currentTime) {
    const times = checkpointList
        .map(cp => Number(cp.href.split('#')[1]))
        .sort((a, b) => a - b)
    
    for (let i = times.length - 1; i >= 0; i--) {
        if (times[i] <= currentTime)
            return times[i]
    }

    return -1
}








// getting info from Python Flask (session cookies)
function getFromFlask(sessionVideoInfo, sessionCheckpoints) {
    if (Object.keys(sessionVideoInfo).length === 0)
        return

    // ask whether or not to load data from cookies
    const answer = confirm('Video(s) were found from your previous session. Would you like to load them now?\nPress \'Ok\' to load.\nPress \'Cancel\' to lose them irreversibly.')
    if (!answer) {
        updateCookie('checkpoints', [])
        updateCookie('video_info', {})
        return
    }

    // dealing with videos
    for (let [id, time] of Object.entries(sessionVideoInfo)) {
        createVideo(id, allVideos, Number(time))
    }
    enableButtons()

    // dealing with checkpoints
    if (sessionCheckpoints.length === 0)
        return
    for (let timeSec of sessionCheckpoints) {
        createCheckpoint(timeSec, checkpoints, allVideos)
    }
    document.getElementById('jump-button').disabled = false
}

// sending info to Python Flask (session cookies)
function updateCookie(cookieName, data) {
    fetch('/update-cookie', {
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

// separate func for updating video_info cookie (requires more steps)
function updateVideoInfoCookie(videoList) {
    if (Object.keys(videoList).length === 0)
        return

    let cookieData = {}
    for (let vid of videoList['videoObjects'])
        cookieData[vid.getVideoData().video_id] = vid.getCurrentTime().toFixed(1)
    updateCookie('video_info', cookieData)
}
