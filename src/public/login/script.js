// Definir los elementos del DOM
const body = document.body;
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const form = document.querySelector("form");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const eye = document.querySelector(".seePassword");

document.addEventListener("DOMContentLoaded", () => {
    // Verificar si la cookie está habilitada para establecer el modo oscuro
    const darkModeCookie = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("darkMode="));
    const isDarkModeEnabled = darkModeCookie && darkModeCookie.split("=")[1] === "true";
    darkModeToggle.checked = isDarkModeEnabled;
    toggleDarkMode();

    // Evento de cambio para el interruptor de modo oscuro
    darkModeToggle.addEventListener("change", toggleDarkMode);
});

// Función para cambiar el modo oscuro
function toggleDarkMode() {
    const darkModeEnabled = darkModeToggle.checked;
    body.classList.toggle("dark-mode", darkModeEnabled);

    // Establecer la cookie darkMode en true o false
    document.cookie = `darkMode=${darkModeEnabled}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function togglePasswordVisibility() {
    if (password.type == "password") {
        password.type = "text";
        eye.style.opacity = 0.8;
    } else {
        password.type = "password";
        eye.style.opacity = 0.2;
    }
}

function createNotification(type, notificationText) {
    let background;
    let color;

    if (type == "success") {
        background = "#d4edda";
        color = "#155724";
    } else if ((type = "error")) {
        background = "#f8d7da";
        color = "#721c24";
    }
    return Toastify({
        text: notificationText,
        duration: 3000,
        style: { background, color },
    }).showToast();
}

function login() {
    const data = {
        email: email.value,
        password: password.value,
    };
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((response) => response.json()).then((data) => {
        if(!data.success) return createNotification("error", data.message)
        window.location.href = "/chat";
    }).catch((error) => {
        console.error(error);
    });
}