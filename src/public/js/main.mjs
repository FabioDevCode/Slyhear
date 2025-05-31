import * as nav from "./nav.mjs";

nav.activeMenuBtnAndBreadcrumb();
document.querySelector("#logout")?.addEventListener("click", function() {
	document.cookie = "slyhear=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.replace('/');
});

window.addEventListener("DOMContentLoaded", () => {
	const jobId = localStorage.getItem("activeJobId");
	if (jobId) {
	  pollDownloadProgress(jobId);
	}
});