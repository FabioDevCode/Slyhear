let allTrashBtn = document.querySelectorAll("[data-trash]");

const showList = () => {
	const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
	const ulAllList = document.querySelector("[data-slyher-list]");
	let content = "";

	if (arrayList.length) {
		for (const link of arrayList) {
			content += `<li><div><h3>${link.title}</h3><p>${link.url}</p></div><div class="trash-list"><button data-trash="" data-trash-title="${link.title}"><i class="fas fa-times"></i></button></div></li>`;
		}
	} else {
		content = '<div class="none-list"><i class="far fa-frown"></i><p>Votre liste est vide</p></div>';
	}

	ulAllList.innerHTML = content;
	content = "";
	allTrashBtn = document.querySelectorAll("[data-trash]");

	for (const trash_btn of allTrashBtn) {
		trash_btn.addEventListener("click", function () {
			const titleToRemove = this.getAttribute("data-trash-title");
			const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
			const updatedArrayList = arrayList.filter(
				(item) => item.title !== titleToRemove,
			);
			localStorage.setItem("slyhear-list", JSON.stringify(updatedArrayList));
			showList();
		});
	}
};

showList();

// Ajouter à la liste -------------------------------------------------- //
document.querySelector("[btn-add-list]").addEventListener("click", () => {
	const url = document.querySelector('[name="url"]');
	const title = document.querySelector('[name="title"]');

	if (!url.value.length || !title.value.length) {
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

	const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));

	for (const musicObj of arrayList) {
		if (url.value === musicObj.url) {
			Toastify({
				text: "Cette URL est déjà présente dans la liste. Veuillez changer l'URL avant de Valider",
				className: "warning",
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
	}

	arrayList.push({
		url: url.value.trim(),
		title: title.value.trim(),
	});

	arrayList.sort((a, b) => {
		return a.title.localeCompare(b.title);
	});

	localStorage.setItem("slyhear-list", JSON.stringify(arrayList));

	url.value = "";
	title.value = "";

	showList();
});

// Vider la liste ------------------------------------------------------ //
document.querySelector("[btn-clear-list]").addEventListener("click", () => {
	if (window.confirm("Êtes-vous sûre de vouloir vider la liste ?")) {
		localStorage.setItem("slyhear-list", JSON.stringify([]));
		Toastify({
			text: "Liste vider avec succès !",
			className: "success",
			duration: 3000,
			newWindow: true,
			close: false,
			gravity: "bottom",
			position: "left",
			stopOnFocus: true,
			onClick: () => {},
		}).showToast();

		showList();
	}
});

// DRAG AND DROP FILE ================================================= //
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

// Télécharger exemple de JSON ------------------------------------------- //
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

// CALL AJAX TO DOWNLOAD ======================================================== //
document.querySelector("[btn-download-list]").addEventListener("click", async () => {
	document.querySelector("#main_download");
	const listToDownload = JSON.parse(localStorage.getItem("slyhear-list"));


	if (!listToDownload.length) {
		Toastify({
			text: "Votre liste est vide.",
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

	document.querySelector("#downloader-loader").classList.add("loader");
	document.querySelector("#downloader").classList.remove("none");

	const call = await fetch("/action/download", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			list: listToDownload.map((el) => {
				return {
					...el,
					name: el.url?.split("?v=")[1]?.split('&')[0] || "",
				};
			}).sort((a, b) => a.name.localeCompare(b.name)),
		}),
	});

	const response = await call.json();

	document.querySelector("#downloader").classList.add("none");
	document.querySelector("#downloader-loader").classList.remove("loader");

	if (!response?.ok) {
		Toastify({
			text: "Une erreur s'est produite lors du téléchargement.",
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
		localStorage.setItem("slyhear-list", JSON.stringify([]));
		Toastify({
			text: "Le téléchargement est un succès !",
			className: "success",
			duration: 3000,
			newWindow: true,
			close: false,
			gravity: "bottom",
			position: "left",
			stopOnFocus: true,
			onClick: () => {},
		}).showToast();
		showList();
	}
});
