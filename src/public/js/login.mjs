// LOGIN
document.getElementById("login_form")?.addEventListener("submit", async function(e) {
    try {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        Object.keys(values).forEach(key => {
            if (typeof values[key] === 'string') {
                values[key] = values[key].trim();
            }
        });

        const call = await fetch("/action/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        });

        const resp = await call.json();

        if(resp.cookie) {
            document.cookie = `slyhear=${resp.cookie}; path=/;`;
	        window.location.replace('/library');
        }
    } catch (err) {
        console.error(err);
        // toastr erreur
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

const passwordInput = document.querySelector('input[name="password"]');
const toggleButton = document.getElementById("toggle-password");

toggleButton.addEventListener('mousedown', () => {
    document.querySelector(".pwd-fa-eye").classList.add("none");
    document.querySelector(".pwd-fa-eye-slash").classList.remove("none");
    passwordInput.type = 'text';
});

toggleButton.addEventListener('mouseup', () => {
    document.querySelector(".pwd-fa-eye").classList.remove("none");
    document.querySelector(".pwd-fa-eye-slash").classList.add("none");
    passwordInput.type = 'password';
});

toggleButton.addEventListener('mouseleave', () => {
    document.querySelector(".pwd-fa-eye").classList.remove("none");
    document.querySelector(".pwd-fa-eye-slash").classList.add("none");
    passwordInput.type = 'password';
});