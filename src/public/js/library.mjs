const strLibrary = localStorage.getItem("library");

if(strLibrary?.length) {
    document.querySelectorAll(".btn-style-list").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector("#library_sounds").classList.remove("grid");
    document.querySelector("#library_sounds").classList.remove("list");
    document.querySelector("#library_sounds").classList.add(strLibrary);
    document.querySelector(`[type="${strLibrary}"]`)?.classList.add("active");
} else {
    document.querySelector("#library_sounds").classList.remove("list");
    document.querySelector("#library_sounds").classList.add("grid");
    document.querySelector('[type="grid"]')?.classList.add("active");
}

document.querySelectorAll(".btn-style-list").forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".btn-style-list").forEach(el => el.classList.remove("active"));
        this.classList.add("active");

        const type = this.getAttribute("type");

        localStorage.setItem("library", type);

        document.querySelector("#library_sounds").classList.remove("grid");
        document.querySelector("#library_sounds").classList.remove("list");
        document.querySelector("#library_sounds").classList.add(type);
    })
});

// Function pour supprimer le morceaux de musique ======================//
document.querySelectorAll(".delete_btn").forEach(delBtn => {
    delBtn.addEventListener("click", async function() {
        if(!confirm("Êtes-vous sûr de vouloir supprimer cette musique ?")) {
            return
        }

        const track_id = this.getAttribute("track-id");

        try {
            const call = await fetch(`/action/delete/${track_id}`);
            const response = await call.json();

            if(!response.ok) {
                Toastify({
                    text: "Une erreur s'est produite lors de la suppression.",
                    className: "error",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom",
                    position: "left",
                    stopOnFocus: true,
                    onClick: () => {},
                }).showToast();
                return;
            } else {
                document.querySelector(`[data-tracks-id="${track_id}"]`).remove();
                Toastify({
                    text: "Le suppression est un succès !",
                    className: "success",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom",
                    position: "left",
                    stopOnFocus: true,
                    onClick: () => {},
                }).showToast();
                return;
            }
        } catch (err) {
            console.error(err);
            Toastify({
                text: "Une erreur s'est produite.",
                className: "error",
                duration: 3000,
                newWindow: true,
                close: false,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                onClick: () => {},
            }).showToast();
            return;
        }
    })
})