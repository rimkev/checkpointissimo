// managing video swapping in homepage

// defining buffers
const videoBuffer1 = document.getElementById('starting-page-video-buffer-1')
const videoBuffer2 = document.getElementById('starting-page-video-buffer-2')
let shownBuffer = videoBuffer1
let hiddenBuffer = videoBuffer2

// all videos
const videos = [
    'static/media/playing-flute.mp4',
    'static/media/playing-synth.mp4'
]
let index = 0

// showing the next video in homepage
function showNext() {
    // loading and playing the next one
    index = (index + 1) % videos.length
    if (hiddenBuffer.src !== videos[index]) { // load if not the correct one already
        hiddenBuffer.src = videos[index]
        hiddenBuffer.load()
    }
    hiddenBuffer.play()
    // displaying the hidden
    hiddenBuffer.hidden = false
    setTimeout(() => {
        // covering the shown
        shownBuffer.hidden = true
        // swapping the variables
        let temp = shownBuffer
        shownBuffer = hiddenBuffer
        hiddenBuffer = temp
    }, 100)
}

// repetitively swapping video buffers to display all the videos stutter-free
setInterval(() => {
    showNext()
}, 10_000)
