const resetListAfterDownload = () => {
	const ul = document.getElementById("link_list");

	ul.innerHTML = "";

	const emptyMessage = document.createElement("div");
	emptyMessage.className = "none-list";
	emptyMessage.setAttribute("id", "none-list");

	const icon = document.createElement("i");
	icon.className = "far fa-frown";

	const text = document.createElement("p");
	text.textContent = "Votre liste est vide";

	emptyMessage.appendChild(icon);
	emptyMessage.appendChild(text);

	ul.appendChild(emptyMessage);
};

function pollDownloadProgress(jobId) {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/action/progress/${jobId}`);
            if (!res.ok) throw new Error("Job introuvable");

            const { status } = await res.json();

            if(window.location.pathname === "/download" && status !== "finished") {
                document.querySelector("#downloader-loader").classList.add("loader");
                document.querySelector("#downloader").classList.remove("none");
            }

            if (status === "finished") {
                clearInterval(interval);
                localStorage.removeItem("activeJobId");
                Toastify({
                text: "Le téléchargement est un succès !",
                className: "success",
                duration: 3000,
                gravity: "bottom",
                position: "left",
                }).showToast();
                document.querySelector("#downloader").classList.add("none");
                document.querySelector("#downloader-loader").classList.remove("loader");
                resetListAfterDownload();
            }

            if (status === "error") {
                clearInterval(interval);
                localStorage.removeItem("activeJobId");
                Toastify({
                text: "Le téléchargement a échoué.",
                className: "error",
                duration: 3000,
                gravity: "bottom",
                position: "left",
                }).showToast();
                document.querySelector("#downloader").classList.add("none");
                document.querySelector("#downloader-loader").classList.remove("loader");
            }
        } catch (err) {
            clearInterval(interval);
            document.querySelector("#downloader").classList.add("none");
            document.querySelector("#downloader-loader").classList.remove("loader");
            console.error(err);
        }
    }, 100);
};