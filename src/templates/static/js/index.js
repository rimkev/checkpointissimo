// managing video swapping in homepage
// !! has a problem of requesting the same resouce multiple times at the same time. Fix later. !!

// buffers
const videoBuffer1 = document.getElementById("starting-page-video-buffer-1")
const videoBuffer2 = document.getElementById("starting-page-video-buffer-2")

// all videos
const videos = [
    "static/media/playing-flute.mp4",
    "static/media/playing-synth.mp4"
]
let index = 0

// videoBuffer1 listener
videoBuffer1.addEventListener("canplay", () => {
    videoBuffer1.hidden = false
    videoBuffer2.hidden = true
    setTimeout(function(){
        index = (index + 1) % videos.length
        videoBuffer2.src = videos[index]
        videoBuffer2.load()
        videoBuffer2.play()
    }, 10_000)
})

// videoBuffer2 listener
videoBuffer2.addEventListener("canplay", () => {
    videoBuffer2.hidden = false
    videoBuffer1.hidden = true
    setTimeout(function(){
        index = (index + 1) % videos.length
        videoBuffer1.src = videos[index]
        videoBuffer1.load()
        videoBuffer1.play()
    }, 10_000)
})