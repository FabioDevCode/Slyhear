const btnCreate = document.querySelector("#btn_create_playlist");
const btnSave = document.querySelector("#btn_save_playlist");
const listFields = document.querySelector("#list_fields");
const createFields = document.querySelector("#create_fields");
const updateFields = document.querySelector("#update_fields");
const showFields = document.querySelector("#show_fields");

const tracks = document.querySelectorAll('.playlist_track');

const getSelectedTracks = () => {
    const selectedTracks = document.querySelectorAll('.playlist_track[selected]');
    return Array.from(selectedTracks).map(track => parseInt(track.getAttribute('track-id')));
};

function setSelectedTracks(idArray) {
  const tracks = document.querySelectorAll('.playlist_track');
  tracks.forEach(track => {
    const trackId = parseInt(track.getAttribute('track-id'));
    if (idArray.includes(trackId)) {
        track.setAttribute('selected', '');
    } else {
        track.removeAttribute('selected');
    }
  });
}

tracks.forEach(track => {
    track.addEventListener('click', function() {
        if (this.hasAttribute('selected')) {
            this.removeAttribute('selected');
        } else {
            this.setAttribute('selected', '');
        }
    });
})

// Création d'une nouvelle liste de lecture
document.getElementById('save_new_playlist').addEventListener('click', async () => {
    try {
        const title = document.querySelector('input[name="title"]')?.value?.trim();
        const trackIds = getSelectedTracks();

        if(!title) {
            Toastify({
                text: "Veuillez remplir le nom de la liste de lecture",
                className: "error",
                duration: 3000,
                gravity: "bottom",
                position: "left",
            }).showToast();
            return;
        }

        if(!trackIds?.length) {
            Toastify({
                text: "Veuillez sélectionner des musiques dans la liste",
                className: "error",
                duration: 3000,
                gravity: "bottom",
                position: "left",
            }).showToast();
            return;
        }

        const call = await fetch("/action/new_playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                trackIds
            }),
        });
        const resp = await call.json();

        if(!resp.message) {
            Toastify({
                text: "Une erreur s'est porduite lors de l'enregistrement.",
                className: "error",
                duration: 3000,
                gravity: "bottom",
                position: "left",
            }).showToast();
            return;
        }

        Toastify({
            text: "Nouvelle liste de lecture enregistrée avec succés !",
            className: "success",
            duration: 5000,
            newWindow: true,
            close: false,
            gravity: "bottom",
            position: "left",
            stopOnFocus: true,
            onClick: () => {},
        }).showToast();

        // Repasser sur la liste
    } catch (err) {
        Toastify({
            text: "Erreur lors de l'enregistrement.",
            className: "error",
            duration: 3000,
            gravity: "bottom",
            position: "left",
		}).showToast();
		return;
    }
});