// INTERFACE PLAYER AUDIO ============================================ //
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');

// Tableau des chansons
const songs = Array.from(document.querySelectorAll('.track')).map(track => track.getAttribute('song-id'));
let _currentSongIndex = 0;

// Fonction pour exécuter une action à chaque changement de currentSongIndex
const onSongIndexChange = (newIndex) => {
    document.querySelectorAll('.track').forEach(track => {
        track.classList.remove('active');
    });
    const currentPlayedSong = document.querySelector(`[song-id="${songs[newIndex]}"]`);
    const currentImgSong = currentPlayedSong.querySelector('img');

    document.querySelector("#player_img").setAttribute("src", currentImgSong.getAttribute('src'));
    document.querySelector("#main_img").setAttribute("src", currentImgSong.getAttribute('src'));
    currentPlayedSong.classList.add('active');
    currentPlayedSong.scrollIntoView({
        behavior: "smooth",
        block: "center"
    })
};

// Utilisation d'un setter personnalisé pour currentSongIndex
Object.defineProperty(window, 'currentSongIndex', {
    get: function() {
        return _currentSongIndex;
    },
    set: function(newIndex) {
        if (_currentSongIndex !== newIndex) {
            _currentSongIndex = newIndex; // Mise à jour de la valeur de currentSongIndex
            onSongIndexChange(newIndex);  // Appel de la fonction pour exécuter une action
        }
    }
});

const currentPlayedSong = document.querySelector(`[song-id="${songs[currentSongIndex]}"]`);
const currentImgSong = currentPlayedSong.querySelector('img');
document.querySelector("#player_img").setAttribute("src", currentImgSong.getAttribute('src'));
document.querySelector("#main_img").setAttribute("src", currentImgSong.getAttribute('src'));

let audioSource = null; // Permet de gérer le flux

// Fonction pour charger et streamer une chanson
const loadSong = (songCode) => {
    // Créer une nouvelle URL de streaming via l'API avec le code
    audioSource = new Audio(`/action/stream/${songCode}`);
    audio.src = audioSource.src; // Met à jour la source de l'élément audio
    // Mettre à jour la barre de progression à chaque fois que la chanson change
    progressBar.value = 0;
};

// Gérer les événements des pistes (clique sur une chanson)
document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', function() {
        currentSongIndex = this.getAttribute('index');
        loadSong(songs[currentSongIndex]);
        audio.play();
    });
});

// Charger la première chanson
loadSong(songs[currentSongIndex]);

// Écouteurs d'événements pour les boutons de contrôle
playButton.addEventListener('click', () => {
    audio.play();
});

pauseButton.addEventListener('click', () => {
    audio.pause();
});

stopButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
});

prevButton.addEventListener('click', () => {
    const newIndex = Number.parseInt(currentSongIndex) - 1;
    if(newIndex < 0) {
        currentSongIndex = songs.length - 1;
    } else {
        currentSongIndex = newIndex
    }
    loadSong(songs[currentSongIndex]);
    audio.play();
});

nextButton.addEventListener('click', () => {
    const newIndex = Number.parseInt(currentSongIndex) + 1;
    if(newIndex > songs.length - 1) {
        currentSongIndex = 0;
    } else {
        currentSongIndex = newIndex;
    };

    loadSong(songs[currentSongIndex]);
    audio.play();
});

// Mise à jour de la barre de progression
audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

// Permettre de changer la progression via la barre
progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Ajouter un événement pour changer de chanson à la fin du morceau
audio.addEventListener('ended', () => {
    // Incrémenter l'index de la chanson actuelle et jouer la suivante
    currentSongIndex = (Number.parseInt(currentSongIndex) + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audio.play();  // Jouer automatiquement la chanson suivante
});

// CLAVIER MAPPING ============================================================= //
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'Space': // Lecture / Pause
            event.preventDefault(); // Empêche le scroll vers le bas
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            break;
        case 'KeyS': // Stop
            audio.pause();
            audio.currentTime = 0;
            break;
        case 'ArrowLeft': // Précédent
            prevButton.click();
            break;
        case 'ArrowRight': // Suivant
            nextButton.click();
            break;
        case 'ArrowUp': // Avancer dans la musique
            audio.currentTime = Math.min(audio.currentTime + 10, audio.duration); // Avance de 5s
            break;
        case 'ArrowDown': // Reculer dans la musique
            audio.currentTime = Math.max(audio.currentTime - 10, 0); // Recule de 5s
            break;
    }
});
