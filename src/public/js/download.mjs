const handleTrashClick = async(id) => {
	if(!id) return;
	await fetch(`/action/remove_list/${id}`);
	const link = document.querySelector(`[data-link-id="link_${id}"]`);
	if(link) {
		link.remove();
	};
};

const createLinkElement = (link) => {
	const li = document.createElement("li");
	li.setAttribute("data-link-id", `link_${link.id}`)

	const contentDiv = document.createElement("div");

	const title = document.createElement("h3");
	title.textContent = link.title;
	contentDiv.appendChild(title);

	const url = document.createElement("p");
	url.textContent = link.url;
	contentDiv.appendChild(url);

	const trashDiv = document.createElement("div");
	trashDiv.className = "trash-list";

	const button = document.createElement("button");
	button.setAttribute("data-trash", "");
	button.setAttribute("data-trash-id", link.id);
	button.setAttribute("data-trash-title", link.title);

	const icon = document.createElement("i");
	icon.className = "fas fa-times";

	button.appendChild(icon);
	trashDiv.appendChild(button);

	button.onclick = () => handleTrashClick(link.id);

	li.appendChild(contentDiv);
	li.appendChild(trashDiv);

	return li;
};

document.querySelectorAll('[data-trash]').forEach(btn => {
	btn.addEventListener("click", async() => {
		await handleTrashClick(btn.getAttribute('data-trash-id'))
	})
});

// Ajouter à la liste ======================================================= //
document.querySelector("[btn-add-list]").addEventListener("click", async() => {
	const url = document.querySelector('[name="url"]')?.value;
	const title = document.querySelector('[name="title"]')?.value;

	if (!url || !title) {
		Toastify({
			text: "Veuillez remplir une URL et un TITRE",
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

	const call = await fetch("/action/add_list", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			url,
			title
		}),
	});

	const resp = await call.json();

	if(resp?.link) {
		document.querySelector('[name="url"]').value = "";
		document.querySelector('[name="title"]').value = "";

		const noneElement = document.getElementById("none-list");
		if(noneElement) {
			noneElement.remove();
		}
		document.getElementById("link_list").insertAdjacentElement("beforeend" , createLinkElement(resp.link));
	};
});

// DRAG AND DROP FILE ============================================== //
const inputFile = document.querySelector("[input-dropzone]");
const fileContainer = document.querySelector("[drag-and-drop-zone]");

fileContainer.addEventListener("dragover", (e) => {
	e.preventDefault();
});

fileContainer.addEventListener("drop", (e) => {
	e.preventDefault();
	if (e.dataTransfer.items.length > 1) {
		Toastify({
			text: "Veuillez importer un seul fichier.",
			className: "error",
			duration: 5000,
			newWindow: true,
			close: false,
			gravity: "bottom",
			position: "left",
			stopOnFocus: true,
			onClick: () => {},
		}).showToast();
	} else if (e.dataTransfer.items.length === 1) {
		[...e.dataTransfer.items].forEach((item, i) => {
			if (item.kind === "file") {
				const file = item.getAsFile();
				const reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {
					const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
					const newArray = [...arrayList, ...JSON.parse(reader.result)];
					localStorage.setItem("slyhear-list", JSON.stringify(newArray));
					Toastify({
						text: "Importation de la liste avec succès !",
						className: "success",
						duration: 5000,
						newWindow: true,
						close: false,
						gravity: "bottom",
						position: "left",
						stopOnFocus: true,
						onClick: () => {},
					}).showToast();

					showList();
				};
				reader.onerror = () => {
					console.error(reader.error);
					Toastify({
						text: "Une erreur s'est produite, veuillez réessayer plutard.",
						className: "error",
						duration: 5000,
						newWindow: true,
						close: false,
						gravity: "bottom",
						position: "left",
						stopOnFocus: true,
						onClick: () => {},
					}).showToast();
				};
			}
		});
	}
});

inputFile.addEventListener("change", (e) => {
	const file = e.target.files[0] || e.dataTransfer.files[0];
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onload = () => {
		const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
		const newArray = [...arrayList, ...JSON.parse(reader.result)];
		localStorage.setItem("slyhear-list", JSON.stringify(newArray));
		showList();
	};
	reader.onerror = () => {
		console.error(reader.error);
		Toastify({
			text: "Une erreur s'est produite, veuillez réessayer plutard.",
			className: "error",
			duration: 5000,
			newWindow: true,
			close: true,
			gravity: "bottom",
			position: "left",
			stopOnFocus: true,
			onClick: () => {},
		}).showToast();
	};
});

// Télécharger exemple de JSON =========================================== //
document.querySelector("[btn-dl-exemple]").addEventListener("click", () => {
	const exemple = [
		{
			url: "https://www.youtube.com/watch?v=V62xgYWKnJQ",
			title: "Carpoolboys & Jean Juan - Applause",
		},
		{
			url: "https://www.youtube.com/watch?v=SL_nGCX4SSs",
			title: "Daft Punk - Television Rules The Nation / Crescendolls (Remake)",
		},
	];

	const dataStr = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exemple))}`;
	const downloadLink = document.querySelector("[link-dl-exemple]");
	downloadLink.setAttribute("href", dataStr);
	downloadLink.setAttribute("download", "Slyhear.json");
	downloadLink.click();
});

// DOWNLOAD ======================================================================= //
document.querySelector("[btn-download-list]").addEventListener("click", async () => {
	document.querySelector("#downloader-loader").classList.add("loader");
	document.querySelector("#downloader").classList.remove("none");

	const call = await fetch("/action/download");
	const resp = await call.json();

	if (!resp.jobId) {
		Toastify({
		  text: "Erreur lors du lancement du téléchargement",
		  className: "error",
		  duration: 3000,
		  gravity: "bottom",
		  position: "left",
		}).showToast();
		return;
	}

	localStorage.setItem("activeJobId", resp.jobId);

	pollDownloadProgress(resp.jobId);
});
