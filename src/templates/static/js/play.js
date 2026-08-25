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
    let videoId = getVideoId()
    createVideo(videoId)
}
// prompting the user for video id
function getVideoId() {
    // prompt user
    let wholeLink = prompt('Enter a Youtube video link: ')

    // extracting
    if (wholeLink.includes('youtube.com')) {
        if (wholeLink.includes('&list=')) {
            return wholeLink.split('/watch?v=')[1].split('&list=')[0]
        } else {
            return wholeLink.split('/watch?v=')[1]
        }
    } else if (wholeLink.includes('youtu.be')) {
        return wholeLink.split('youtu.be/')[1].split('?si=')[0]
    }
}
// creating the necessary video div element and calling another function to turn it into IFrame
function createVideo(videoId) {
    // create new div, which gets replaced by Youtube's iFrame
    const videoSection = document.getElementById('video-playback-section')
    const newDiv = document.createElement('div')
    newDiv.className = 'yt-video'
    // append it to the screen
    videoSection.append(newDiv)
    // create the video iFrame
    createVideoIFrame(newDiv, videoId)
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
                console.error('YouTube player error:', event.data)
            },
        },
    })
}







// VIDEO REMOVAL
// button click action
document.getElementById('remove-video-button').onclick = function() {
    removeLastVideo()
}
// removing last video from the list
function removeLastVideo() {
    let videoElements = document.getElementsByClassName('yt-video')
    if (videoElements.length !== 0)
        videoElements[videoElements.length - 1].remove()
    else
        alert('Video list is already empty.')
}
