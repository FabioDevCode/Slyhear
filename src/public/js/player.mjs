// INTERFACE PLAYER AUDIO ============================================ //
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const progressTime = document.getElementById("progress-time");
const progressDuration = document.getElementById("progress-duration");
const randomButton = document.querySelector("#random");
const boucleButton = document.querySelector("#boucle");
const seekAmount = 5; // Nombre de secondes à avancer/reculer

// normal, random or same
let orderType = "normal";

randomButton.addEventListener("click", function() {
    boucleButton.classList.remove("active");
    if(Array.from(this.classList).includes("active")) {
        this.classList.remove("active");
        orderType = "normal";
    } else {
        this.classList.add("active");
        orderType = "random"
    }
});

boucleButton.addEventListener("click", function() {
    randomButton.classList.remove("active");
    if(Array.from(this.classList).includes("active")) {
        this.classList.remove("active");
        orderType = "normal";
    } else {
        this.classList.add("active");
        orderType = "same"
    }
});


function clickOnPlay() {
    playButton.classList.add("none");
    pauseButton.classList.remove("none");
};

function clickOnPause() {
    pauseButton.classList.add("none");
    playButton.classList.remove("none");
};

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
};

function getContrastColor(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#101010' : '#F1F1F1';
};

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

    document.querySelector("#main_bloc").removeAttribute("style");
    document.querySelector("#main_bloc").setAttribute("style", `background-image: url('${currentImgSong.getAttribute('src')}')`);
    document.querySelector("#main_img").setAttribute("src", currentImgSong.getAttribute('src'));
    document.querySelector("#name_sound").removeAttribute("style");
    document.querySelector("#name_sound").setAttribute("style", `--color: ${getContrastColor(currentPlayedSong.getAttribute('track-color'))}`);
    document.querySelector("#name_sound").textContent = currentPlayedSong.getAttribute('track-title');

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

onSongIndexChange(currentSongIndex);

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
        clickOnPlay();
        audio.play();
    });
});

// Charger la première chanson
loadSong(songs[currentSongIndex]);

// Écouteurs d'événements pour les boutons de contrôle
playButton.addEventListener('click', () => {
    clickOnPlay();
    audio.play();
});

pauseButton.addEventListener('click', () => {
    clickOnPause();
    audio.pause();
});

stopButton?.addEventListener('click', () => {
    clickOnPause();
    audio.pause();
    audio.currentTime = 0;
});

prevButton.addEventListener('click', () => {
    let newIndex;

    switch(orderType) {
        case "normal":
            newIndex = Number.parseInt(currentSongIndex) - 1;
            if(newIndex < 0) {
                currentSongIndex = songs.length - 1;
            } else {
                currentSongIndex = newIndex
            }
            break;
        case "random":
            // Cas avec random : on sélectionne un index aléatoire
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === currentSongIndex);
            currentSongIndex = newIndex;
            break;
        default:
            break;
    }

    loadSong(songs[currentSongIndex]);
    clickOnPlay();
    audio.play();
});

nextButton.addEventListener('click', () => {
    let newIndex;

    switch(orderType) {
        case "normal":
            newIndex = Number.parseInt(currentSongIndex) + 1;
            if(newIndex > songs.length - 1) {
                currentSongIndex = 0;
            } else {
                currentSongIndex = newIndex;
            };
            break;
        case "random":
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === currentSongIndex);
            currentSongIndex = newIndex;
            break;
        default:
            break;
    }

    loadSong(songs[currentSongIndex]);
    clickOnPlay();
    audio.play();
});

// Permettre de changer la progression via la barre
progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Ajouter un événement pour changer de chanson à la fin du morceau
audio.addEventListener('ended', () => {
    let newIndex;

    switch(orderType) {
        case "normal":
            currentSongIndex = (Number.parseInt(currentSongIndex) + 1) % songs.length;
            break;
        case "random":
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === currentSongIndex);
            currentSongIndex = newIndex;
            break;
        default:
            break;
    }

    loadSong(songs[currentSongIndex]);
    audio.play();
});

audio.addEventListener("loadedmetadata", () => {
    progressDuration.textContent = formatTime(Math.round(audio.duration));
    progressBar.removeAttribute("step");
    progressBar.setAttribute("step", 100/Math.round(audio.duration));
});

// Mise à jour de la barre de progression
audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / Math.round(audio.duration)) * 100 || 0;
    progressTime.textContent = formatTime(Math.round(audio.currentTime));
});

// CLAVIER MAPPING ============================================================= //
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'Space': // Lecture / Pause
            event.preventDefault(); // Empêche le scroll vers le bas
            if (audio.paused) {
                clickOnPlay();
                audio.play();
            } else {
                clickOnPause();
                audio.pause();
            }
            break;
        case 'ArrowLeft':
            audio.currentTime = Math.max(audio.currentTime - seekAmount, 0);
            break;
        case 'ArrowRight':
            audio.currentTime = Math.min(audio.currentTime + seekAmount, Math.round(audio.duration));
            break;
        case 'ArrowUp':
            prevButton.click();
            break;
        case 'ArrowDown':
            nextButton.click();
            break;
        default:
            break;
    }

    switch(event.key) {
        case 'a':
        case 'A':
            randomButton.click();
            break;
        case 'b':
        case 'B':
            boucleButton.click();
            break;
        case 's':
        case 'S':
            clickOnPause();
            audio.pause();
            audio.currentTime = 0;
            break;
        default:
            break;
    }
});

let lastScrollTime = 0;
const scrollCooldown = 300;
let userInteracted = false;

function enableScrollInteraction() {
    if (!userInteracted) {
        userInteracted = true;
        document.addEventListener("wheel", handleScroll);
        // On enlève les écouteurs d'activation pour éviter plusieurs appels
        document.removeEventListener("click", enableScrollInteraction);
        document.removeEventListener("keydown", enableScrollInteraction);
    }
}

// Activer l'interaction au premier clic ou touche clavier
document.addEventListener("click", enableScrollInteraction);
document.addEventListener("keydown", enableScrollInteraction);

function handleScroll(event) {
    const now = Date.now();
    if (now - lastScrollTime < scrollCooldown) return; // Anti-spam du scroll
    lastScrollTime = now;

    // Scroll vertical (molette haut/bas) pour changer de musique
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // if (event.deltaY > 0) {
        //     nextButton.click(); // Changer la chanson vers la suivante
        // } else if (event.deltaY < 0) {
        //     prevButton.click(); // Changer la chanson vers la précédente
        // }
        // // Si la musique est en pause, on la met en lecture
        // if (audio.paused) {
        //     audio.play().catch(error => console.warn("Lecture bloquée :", error));
        // }
    } else {
        // Scroll horizontal (molette gauche/droite) pour avancer/reculer dans l'audio
        if (event.deltaX > 0) {
            // Scroll vers la gauche -> Reculer dans la musique
            audio.currentTime = Math.max(audio.currentTime - seekAmount, 0);
        } else {
            // Scroll vers la droite -> Avancer dans la musique
            audio.currentTime = Math.min(audio.currentTime + seekAmount, audio.duration);
        }
    }
}
