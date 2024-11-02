export const activeMenuBtnAndBreadcrumb = () => {
	const breadcrumb_map = {
		player: "Lecteur",
		library: "Bibliothèque",
		upload: "Déposer",
		download: "Télécharger",
	};

	const nav_btns = document.querySelectorAll('[data-nav="nav-btn"]');
	for (const btn of nav_btns) {
		btn.classList.remove("active");
	}

	const firtPath = window.location.pathname.split("/")[1];
	document.querySelector(`#${firtPath}`).classList.add("active");
	document.getElementById("breadcrumb").innerHTML = breadcrumb_map[firtPath];
};
