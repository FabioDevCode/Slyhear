const currentTrack = '';
const nextTrack = '';
const playingtrack = '';



document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', function() {
        const title = this.getAttribute('track-title');

        console.log(title);

    })




});














// INTERFACE PLAYER AUDIO ============================================ //
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');

// Tableau des chansons
const songs = ['/audio/song1.mp3', '/audio/song2.mp3'];
let currentSongIndex = 0;

// Charger une chanson
const loadSong = (index) => {
    audio.src = songs[index];
    progressBar.value = 0;
};

loadSong(currentSongIndex);

// Écouteurs d'événements
playButton.addEventListener('click', () => audio.play());
pauseButton.addEventListener('click', () => audio.pause());
stopButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
});
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
});
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
});

// Mise à jour de la barre de progression
audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

// Permettre de changer la progression
progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});