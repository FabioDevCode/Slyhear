import * as nav from './nav.mjs';

nav.activeMenuBtnAndBreadcrumb();




// Init localStorage pour list de téléchargement
if(!localStorage.getItem("slyhear-list")) {
    localStorage.setItem("slyhear-list", JSON.stringify([]));
}
