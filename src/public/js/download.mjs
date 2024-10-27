let allTrashBtn = document.querySelectorAll('[data-trash]');

const showList = () => {
    const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
    const ulAllList = document.querySelector('[data-slyher-list]');
    let content = '';

    for (const link of arrayList) {
        content += `<li><div><h3>${link.title}</h3><p>${link.url}</p></div><div class="trash-list"><button data-trash="" data-trash-url="${link.url}"><i class="fas fa-times"></i></button></div></li>`;
    }
    ulAllList.innerHTML = content;
    content = '';
    allTrashBtn = document.querySelectorAll('[data-trash]');

    for (const trash_btn of allTrashBtn) {
        trash_btn.addEventListener('click', function() {
            const urlToRemove = this.getAttribute('data-trash-url');

            console.log(urlToRemove);

            const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));
            const updatedArrayList = arrayList.filter(item => item.url !== urlToRemove);

            console.log(updatedArrayList);

            localStorage.setItem("slyhear-list", JSON.stringify(updatedArrayList));

            showList();
        })
    };
};

showList();

document.querySelector('[data-btn-add-list]').addEventListener('click', () => {
    const url = document.querySelector('[name="url"]');
    const title = document.querySelector('[name="title"]');

    if (!url.value.length || !title.value.length) {
        Toastify({
            text: "Veuillez remplir une URL et un TITRE",
            className: "error",
            duration: 2500,
            newWindow: true,
            close: false,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: () => {} // Callback after click
        }).showToast();
        return
    }

    const arrayList = JSON.parse(localStorage.getItem("slyhear-list"));

    arrayList.push({
        url: url.value,
        title: title.value
    });

    arrayList.sort((a, b) => {
        return a.title.localeCompare(b.title);
    });

    localStorage.setItem("slyhear-list", JSON.stringify(arrayList));

    url.value = "";
    title.value = "";

    showList();
});