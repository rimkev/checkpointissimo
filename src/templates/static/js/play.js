// author's signature disappears to leave space for the user
window.addEventListener('mousemove', () => {
    setTimeout(() => {
        const footer = document.getElementById('signature-footer')
        footer.hidden = true;
    }, 5_000)
})





// ADDING VIDEO
var allVideos = []
// button click action
document.getElementById('add-video-button').onclick = function() {
    const videoId = getVideoId()
    if (videoId !== -1)
        createVideo(videoId, allVideos)
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
function createVideo(videoId, videoList) {
    // create new div, which gets replaced by Youtube's iFrame
    const newDiv = document.createElement('div')
    newDiv.className = 'yt-video'
    // append it to the screen
    document.getElementById('video-playback-section').append(newDiv)
    // create the video iFrame
    const iFrameObj = createVideoIFrame(newDiv, videoId)
    // push onto a list of all videos
    videoList.push(iFrameObj)
}
// creating a Youtube IFrame out of a div element
function createVideoIFrame(element, videoId) {
    return new YT.Player(element, {
        videoId: videoId,
        playerVars: {
            playsinline: 1,
            origin: window.location.origin,
        },
        height: '300',
        width: '100%',
        events: {
            onError: (event) => {
                // removing the video player due to error after a delay to finish uploading first
                setTimeout(() => {
                    removeLastVideo()
                }, 300)
                alert(`YouTube player error ${event.data}. Video cannot be included.`)
            },
            'onStateChange': (event) => {
                // stop or start all videos when interacted with individually to prevent out of sync situation
                if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                    stopAllVideos(allVideos)
                }
                else if (event.data === YT.PlayerState.PLAYING) {
                    startAllVideos(allVideos)
                }
            }
        },
    })
}







// VIDEO REMOVAL
// button click action
document.getElementById('remove-video-button').onclick = function() {
    removeLastVideo(videoList)
}
// removing last video from the list
function removeLastVideo(videoList) {
    const videoElements = document.getElementsByClassName('yt-video')

    if (videoElements.length !== 0) {
        videoElements[videoElements.length - 1].remove()
        videoList.pop()
        // if all videos were deleted
        if (videoList.length === 0) {
            // removing all checkpoints
            const checkpointSection = document.getElementById('checkpoint-section')
            checkpointSection.replaceChildren()
            checkpoints = []

            // resetting play/pause button
            nowPlaying = false
            changeStartStopBtnAppearance()
        }
    }
    else
        alert('Video list is already empty.')
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
    if (allVideos.length === 0)
        return

    if (nowPlaying) // have to stop
        stopAllVideos(allVideos)
    else // have to start
        startAllVideos(allVideos)
}
// stop all videos
function stopAllVideos(videoList) {
    // pause
    videoList.forEach(vid => vid.pauseVideo())
    // change start/stop button appearance
    nowPlaying = false
    changeStartStopBtnAppearance()
}
// start all videos
function startAllVideos(videoList) {
    // play
    allVideos.forEach(vid => vid.playVideo())
    // change start/stop button appearance
    nowPlaying = true
    changeStartStopBtnAppearance()
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
    if (allVideos.length === 0)
        return

    // create checkpoint
    const timeSec = allVideos[0].getCurrentTime().toFixed(1)
    createCheckpoint(timeSec, checkpoints, allVideos)
}
// create a new checkpoint
function createCheckpoint(timeSec, checkpointList, videoList) {
    if (videoList.length === 0)
        return

    // new CP
    const newCP = document.createElement('a')
    newCP.textContent = getTextFromSec(timeSec)
    newCP.href = `#${timeSec}`
    newCP.addEventListener('click', function(event) {
        event.preventDefault()
        rewind(videoList, timeSec)
    })

    // add to list and section
    document.getElementById('checkpoint-section').append(newCP)
    checkpointList.push(newCP)
}
// generate text representation of seconds
function getTextFromSec(timeSec) {
    const date = new Date(timeSec * 1000)
    return `${date.toISOString().slice(11, 19)}${(timeSec % 1).toFixed(1).substring(1)}`
}
// find out whether any videos cannot go further back (would sync out of the group)
function outOfSyncPossibility(videoList, seekingTime) {
    if (videoList.length !== 0) {
        for (let video of videoList) {
            const timeDffFromFirstVid = video.getCurrentTime().toFixed(1) - videoList[0].getCurrentTime().toFixed(1)
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
        if (videoList.length !== 0) {
            videoList.forEach(vid => {
                const timeDffFromFirstVid = vid.getCurrentTime().toFixed(1) - videoList[0].getCurrentTime().toFixed(1);
                vid.seekTo(Number(seekingTime) + Number(timeDffFromFirstVid) - headstart, true)
            })
            if (!autoplayState)
                stopAllVideos(videoList)
        }
    }
    else {
        alert('Timestamps are based on the very first video on the list. Going to this timestamp would make one or more videos out of sync with others, because they can only be rewinded back to 00:00:00.')
    }
}





// GETTING BACK TO THE LAST CHECKPOINT BEHIND CURRENT TIME
// button click action
document.getElementById('jump-button').onclick = function() {
    if (allVideos.length === 0 || checkpoints.length === 0)
        return

    const lastTime = lastVisitedCPTime(checkpoints, allVideos[0].getCurrentTime().toFixed(1))
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