document.querySelectorAll(".btn-style-list").forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".btn-style-list").forEach(el => el.classList.remove("active"));
        this.classList.add("active");
    })
});


// Function pour supprimer le morceaux de musique ======================//
document.querySelectorAll(".delete_btn").forEach(delBtn => {
    delBtn.addEventListener("click", async function() {
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