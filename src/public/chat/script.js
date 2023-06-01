//UserModal y ChannelModal
const dialogs = document.querySelectorAll("dialog");
const userModal = document.querySelector(".userModal");
const channelModal = document.querySelector(".channelModal");
const seePassword = document.querySelector(".seePassword");
const userModalPassword = document.querySelector(".userModal [name='password']");
const userModalPasswordConfirmation = document.querySelector(".userModal [name='passwordConfirmation']");
const participantInput = document.querySelector(".participantInput");
const photoInputs = document.querySelectorAll(".photoInput");
const channelPhotoInput = document.querySelector(".channelPhotoInput");
const userModalForm = document.querySelector(".userModal form");
const channelModalForm = document.querySelector(".channelModal form");
//---------------------------------------------------------------------------------------------
const menu = document.querySelector(".menu");
const menuOptions = document.querySelector(".menu-options");
const darkModeToggle = document.querySelector(".menu-option input[type=checkbox]");
const messageInput = document.querySelector(".messageInput");
const send = document.querySelector(".send");
const participantList = document.querySelector(".participantList");
const photoDisplay = document.querySelector(".photoDisplay");
const messageInputBox = document.querySelector(".messageInputBox");
const nickname = document.querySelector(".nickname");
const url = new URL(window.location);
const params = url.searchParams;
const socket = io();

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

socket.on("renderData", data => {
    renderData(data);
});

const userCache = {};

function getUserInfo(author) {
    if (userCache[author]) {
        return Promise.resolve(userCache[author]);
    }
    return fetch(`/user?_id=${author}`)
        .then(response => response.json())
        .then(userData => {
            userCache[author] = userData;
            return userData;
        });
}

function renderData(...dataObjects) {
    for (const dataObject of dataObjects) {
        const { type } = dataObject;

        if (type === "eval") {
            return eval(data);
        }

        if (type === "channel") {
            const channelList = document.querySelector(".channels");
            for (const channel of dataObject.channels) {
                const { _id: id, name, description, photo, participants } = channel;
                if (document.querySelector(`.channel[data-channel-id="${id}"]`)) continue;
                socket.emit("joinChannel", id);
                const channelHTML = `
                <div class="channel" onclick="selectChannel(this)" data-channel-id="${id}" tabindex="0">
                    <img class="channelPhoto" src="${photo ? photo : "../Files/grupo.png"}" alt="Foto del canal">
                    <p class="channelName">${sanitizeHtml(name)}</p>
                </div>
                `;
                const channelHeaderHTML = `
                    <div class="channelHeader" data-channel-id="${id}">
                        <span class="material-icons back" title="Ir a los chats" onclick="toggleChats()">arrow_back</span>
                        <img class="channelPhoto" src="${photo ? photo : "../Files/grupo.png"}" alt="Foto del canal">
                        <div class="channelInfo">
                            <p class="channelName">${sanitizeHtml(name)}</p>
                            <p class="participants">${participants.join(", ")}</p>
                        </div>
                        <span class="material-icons channelMenu" title="Menú" onclick="toggleChannelMenu()" tabindex="0">more_vert</span>
                    </div>
                `;
                const messageBoxHTML = `
                  <div class="messageBox channelBox" data-channel-id="${id}">
                  </div>
                `;
                document.querySelector(".right").insertBefore(document.createRange().createContextualFragment(channelHeaderHTML), messageInputBox);
                document.querySelector(".right").insertBefore(document.createRange().createContextualFragment(messageBoxHTML), messageInputBox);
                channelList.insertAdjacentHTML("beforeend", channelHTML);
            }
            return;
        }

        if (type === "message") {
            const { messages, channelId, position } = dataObject;
            const sendTo = document.querySelector(`.messageBox[data-channel-id="${channelId}"]`);
            const containerHeight = sendTo.scrollHeight;
            const scrollTopOffset = sendTo.scrollTop;
            let messagesHTML = "";

            messages
                .reduce((previousPromise, message) => {
                    return previousPromise.then(() => {
                        const { id, author, content, date } = message;
                        return getUserInfo(author).then(userData => {
                            const messageHTML = `
                            <div data-message-id=${id} class="message ${userData.nickname === nickname.dataset.nickname ? "own" : ""}" tabindex="0">
                                <div class="author">
                                    <img src="${userData.photo ? userData.photo : "../Files/sin-foto.png"}" alt="Foto de perfil" class="authorPhoto">
                                    <p class="authorName">${userData.nickname}</p>
                                </div>
                                <div class="content">${sanitizeHtml(content)}</div>
                                <div class="date">${formatDate(date)}</div>
                            </div> 
                        `;
                            messagesHTML += messageHTML;
                        });
                    });
                }, Promise.resolve())
                .then(() => {
                    sendTo.insertAdjacentHTML(position === "beforeend" ? "beforeend" : "afterbegin", messagesHTML);
                    const newContainerHeight = sendTo.scrollHeight;
                    sendTo.scrollTop = newContainerHeight - containerHeight + scrollTopOffset;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}

async function getMessages(channel, limit, offset) {
    const response = await fetch(`/messages?channel=${channel}&limit=${limit}&offset=${offset}`);
    const data = await response.json();
    data.type = "message";
    data.messages.reverse();
    return data;
}

function sanitizeHtml(html) {
    const element = document.createElement("div");
    element.textContent = html;
    return element.innerHTML;
}

function formatDate(timestamp) {
    if (!timestamp) throw new Error("El parámetro 'timestamp' debe ser una fecha válida");

    const date = new Date(timestamp);
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((today - date) / oneDay);

    let hour = date.getHours();
    let period = hour >= 12 ? "p. m." : "a. m.";
    hour = hour % 12 || 12;

    const formattedHour = hour.toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    let formattedDate;

    if (diffDays === 0) {
        formattedDate = `${formattedHour}:${minutes} ${period}`;
    } else if (diffDays === 1) {
        formattedDate = `ayer a las ${formattedHour}:${minutes} ${period}`;
    } else if (diffDays < 7 && diffDays > 1) {
        const weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][date.getDay()];
        formattedDate = `${weekday} a las ${formattedHour}:${minutes} ${period}`;
    } else {
        const month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        formattedDate = `${day} de ${month} de ${year} a las ${formattedHour}:${minutes} ${period}`;
    }

    return formattedDate;
}

const channelsCache = {};
async function selectChannel(selectedChannel) {
    const channelId = selectedChannel.dataset.channelId;
    messageInputBox.style.display = "flex";

    const channels = document.querySelectorAll(".channel");
    selectedChannel.classList.add("selected");
    channels.forEach(channel => {
        if (channel !== selectedChannel) {
            channel.classList.remove("selected");
        }
    });

    // Modificar la URL agregando la id del canal como parámetro
    url.searchParams.set("channel", channelId);
    window.history.pushState({}, "", url);

    // Ocultar todos los headers de canales excepto el correspondiente al canal seleccionado
    const channelHeaders = document.querySelectorAll(".channelHeader");
    channelHeaders.forEach(header => {
        if (header.dataset.channelId === channelId) {
            header.style.display = "flex";
        } else {
            header.style.display = "none";
        }
    });

    // Ocultar todos los contenedores de mensajes excepto el correspondiente al canal seleccionado.
    //También añade un listener para detectar cuando el scroll de SOLO el canal seleccionado llega a su tope.
    const messageBoxes = document.querySelectorAll(".messageBox");
    messageBoxes.forEach(box => {
        if (box.dataset.channelId === channelId) {
            box.style.display = "block";
            box.addEventListener("scroll", handleScroll);
        } else {
            box.style.display = "none";
            box.removeEventListener("scroll", handleScroll);
        }
    });

    if (channelsCache[channelId] && channelsCache[channelId].rendered) return;
    let messages = await getMessages(channelId, 20, 0);
    renderData(messages);
    if (!channelsCache[channelId]) channelsCache[channelId] = {};
    channelsCache[channelId].rendered = true;
}

function handleScroll(event) {
    const container = event.target;
    const channelId = container.dataset.channelId;

    if (!channelsCache[channelId] || (channelsCache[channelId] && !channelsCache[channelId].loadedMessages)) {
        if (container.scrollTop === 0) {
            const existingMessages = container.querySelectorAll(".message");
            const offset = existingMessages.length;
            getMessages(channelId, 20, offset).then(response => {
                if (response.messages.length < 20) channelsCache[channelId].loadedMessages = true;
                renderData(response);
            }).catch(error => console.error(error));
        }
    }
}

// Cerrar el menú desplegable si el usuario hace click fuera de él. Si el usuario hace click en el menú, no se cierra.
window.addEventListener("click", event => {
    if (!event.target.matches(".menu")) {
        menuOptions.classList.remove("show");
    }
});

// Agregar o remover la clase "show" del menú abierto, permitiendo mostrar u ocultar las opciones del menú al hacer click en el botón de menú.
function toggleMenu() {
    menuOptions.classList.toggle("show");
}

//Evitar que se cierre el menú antes de que el usuario haya seleccionado una opción.
menuOptions.addEventListener("click", event => {
    event.stopPropagation();
});

darkModeToggle.addEventListener("click", e => {
    e.stopPropagation();
    toggleDarkMode();
});

function toggleDarkMode() {
    const darkModeEnabled = darkModeToggle.checked;
    document.body.classList.toggle("dark-mode", darkModeEnabled);

    // Establecer la cookie darkMode en true o false
    document.cookie = `darkMode=${darkModeToggle.checked}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

/*Modo oscuro */
document.addEventListener("DOMContentLoaded", () => {
    fetch(`/user`)
        .then(response => response.json())
        .then(data => {
            nickname.textContent = data.nickname;
            nickname.dataset.nickname = data.nickname;
            document.querySelector(".my .name").textContent = data.email;
            if (data.photo) {
                document.querySelector(".profilePhoto").src = data.photo;
                document.querySelector(".userModal .photoDisplay").src = data.photo;
            }
            document.querySelector(".userModal input[name='nickname']").value = data.nickname;
            document.querySelector(".userModal input[name='email']").value = data.email;
        })
        .catch(error => {
            console.error(error);
        });
    params.delete("channel");
    url.search = params.toString();
    window.history.pushState({}, "", url);
    // Modo oscuro
    const darkModeCookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith("darkMode="));
    const isDarkModeEnabled = darkModeCookie && darkModeCookie.split("=")[1] === "true";
    darkModeToggle.checked = isDarkModeEnabled;
    toggleDarkMode();
    darkModeToggle.addEventListener("change", toggleDarkMode);
});

function sendMessage() {
    socket.emit("chat:message", { message: messageInput.value, channel: params.get("channel") });
    messageInput.value = "";
    updateSendButton();
}

function updateSendButton() {
    const hasValue = messageInput.value;

    send.style.opacity = hasValue ? 1 : 0.1;
    send.style.pointerEvents = hasValue ? "auto" : "none";
    send.tabIndex = hasValue ? 0 : -1;
}

//UserModal y ChannelModal
//Por cada elemento dialog, escuchar si se hace click fuera de él y cerrarlo.
dialogs.forEach(dialog => {
    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
            dialog.close();
        }
    });
});

//Por cada elemento con la clase "photoInput" escuchar si se añade un archivo.
photoInputs.forEach(photoInput => {
    photoInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file.type.startsWith("image/")) {
            photoInput.value = "";
            return createNotification("error", "El archivo seleccionado no es una imagen.");
        }
        const imageUrl = URL.createObjectURL(file);
        const photoDisplay = photoInput.nextElementSibling;
        photoDisplay.src = imageUrl;
    });
});

function togglePasswordVisibility() {
    const isPasswordType = userModalPassword.type === "password";
    userModalPassword.type = isPasswordType ? "text" : "password";
    userModalPasswordConfirmation.type = isPasswordType ? "text" : "password";
    seePassword.style.opacity = isPasswordType ? 0.8 : 0.2;
}

function showMenu() {
    menu.show();
}

function showUserModal() {
    userModal.showModal();
}

function closeUserModal() {
    userModal.close();
}

function saveUserModal() {
    const userData = {};
    const promises = [];

    for (const element of userModalForm.elements) {
        if (element.type === "file" && element.files[0]) {
            const file = element.files[0];
            const reader = new FileReader();
            const promise = new Promise(resolve => {
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = Object.assign(document.createElement("canvas"), {
                            width: 500,
                            height: 500,
                        });
                        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, 500, 500);
                        userData[element.name] = canvas.toDataURL(file.type);
                        resolve();
                    };
                    img.src = reader.result;
                };
            });
            reader.readAsDataURL(file);
            promises.push(promise);
        } else if (element.value) {
            userData[element.name] = element.value;
        }
    }

    Promise.all(promises).then(() => {
        fetch("/editUser", {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: {"Content-Type": "application/json"}
        }).then(response => response.json()).then(data => {
            if (!data.success) return createNotification("error", data.message);
            createNotification("success", data.message);
            closeUserModal();
        }).catch(error => console.error(error));
    });
}

function showChannelModal() {
    channelModal.showModal();
}

function closeChannelModal() {
    channelModal.close();
}

function addParticipantToList() {
    const participantNames = document.querySelectorAll(".participant .name");
    const user = participantInput.value;
    let isUserInList = false;

    participantNames.forEach(participantName => {
        if (participantName.textContent == user) {
            isUserInList = true;
            return createNotification("error", `El participante ${user} ya está en la lista.`);
        }
    });

    if (!isUserInList) {
        fetch(`/user?email=${encodeURIComponent(user)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return createNotification("error", data.error);
                } else {
                    const participantHTML = `
                    <div class="participant" tabindex="0">
                        <img class="profilePhoto" src="${data.photo ? data.photo : "../Files/sin-foto.png"}" alt="Foto de perfil">
                        <p name="participantName" class="name">${data.email}</p>
                        <button class="button saveButton removeParticipantButton" onclick="this.parentNode.remove()">Eliminar</button>
                    </div>
                `;
                    participantList.insertAdjacentHTML("beforeend", participantHTML);
                    participantInput.value = "";
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function saveChannelModal() {
    const channelData = {
        participants: [...participantList.querySelectorAll(".name")].map(name => name.textContent),
    };

    const promises = [];

    for (const element of channelModalForm.elements) {
        if (element.type === "file" && element.files[0]) {
            const file = element.files[0];
            const reader = new FileReader();
            const promise = new Promise(resolve => {
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = Object.assign(document.createElement("canvas"), {
                            width: 500,
                            height: 500,
                        });
                        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, 500, 500);
                        channelData[element.name] = canvas.toDataURL(file.type);
                        resolve();
                    };
                    img.src = reader.result;
                };
            });
            reader.readAsDataURL(file);
            promises.push(promise);
        } else if (element.value) {
            channelData[element.name] = element.value;
        }
    }

    Promise.all(promises).then(() => {
        fetch("/createChannel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(channelData),
        }).then(response => response.json()).then(data => {
            if(!data.success) return createNotification("error", data.message);
            createNotification("success", data.message);
            closeChannelModal();
        }).catch(error => {
            console.error(error);
        });
    });
}
