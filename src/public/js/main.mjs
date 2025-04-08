import * as nav from "./nav.mjs";

nav.activeMenuBtnAndBreadcrumb();

// Init localStorage pour list de téléchargement
if (!localStorage.getItem("slyhear-list")) {
	localStorage.setItem("slyhear-list", JSON.stringify([]));
}

document.querySelector("#logout")?.addEventListener("click", function() {
	document.cookie = "slyhear=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.replace('/');
})
