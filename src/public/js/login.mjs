// LOGIN

document.getElementById("login_form")?.addEventListener("submit", async function(e) {
    try {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

        console.log(values);
        console.log("--------");

        const call = await fetch("/action/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        });

        const response = await call.json();

        console.log(response);
    } catch (err) {
        console.error(err);
    }
});

document.getElementById("first_co")?.addEventListener("click", () => {
    document.getElementById("newUser").value = "true";
    document.getElementById("logIn_bloc").classList.add("none");
    document.getElementById("newUser_bloc").classList.remove("none");
});

document.getElementById("comeback_co")?.addEventListener("click", () => {
    document.getElementById("newUser").value = "false";
    document.getElementById("newUser_bloc").classList.add("none");
    document.getElementById("logIn_bloc").classList.remove("none");
});