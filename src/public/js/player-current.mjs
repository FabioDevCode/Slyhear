document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('mouseover', function() {
        const color = this.getAttribute('track-color');
        document.documentElement.style.setProperty('--trackOver', color);
    });
    track.addEventListener('mouseout', function() {
        document.documentElement.style.setProperty('--trackOver', '#c71717');
    })
});