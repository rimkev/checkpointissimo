// author's signature disappears to leave space for the user
window.addEventListener('mousemove', () => {
    setTimeout(() => {
        const footer = document.getElementById('signature-footer')
        footer.hidden = true;
    }, 5_000)
})