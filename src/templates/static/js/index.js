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
