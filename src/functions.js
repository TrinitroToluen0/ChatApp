const db = require("./db.js");
const fs = require("fs");

/**
 * Middleware para redirigir a /chat en el caso de estar logeado
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {function} next - Siguiente función de middleware.
 */
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        res.redirect("/chat");
    } else {
        next();
    }
}

/**
 * Middleware para redirigir a /login en el caso de no estar logeado
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {function} next - Siguiente función de middleware.
 */
function requireLogout(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

/**
 * Transforma los datos de los canales para darselos al cliente.
 * @param {Array<Object>} channels - El array de objetos de canales a transformar.
 * @returns {Promise<Array<Object>>} El array de canales objetos de los canales modificados con los apodos de los participantes actualizados y la foto del canal en base64.
 */
async function parseChannelsData(channels) {
    for (let channel of channels) {
        for (let i = 0; i < channel.participants.length; i++) {
            let user = await db.findUser("_id", channel.participants[i]);
            channel.participants[i] = user.nickname;
        }
        const filePath = `${__dirname}/${channel.photo}`;
        if (channel.photo && fs.existsSync(filePath)) {
            let img = fs.readFileSync(filePath);
            const base64Img = img.toString("base64");
            channel.photo = `data:image/png;base64,${base64Img}`;
        } else channel.photo = "../Files/grupo.png"
    }
    return channels;
}

/**
 * Verifica si un socket está en un canal específico.
 * @param {string} channel - ID del canal.
 * @param {object} socket - Objeto de socket.
 * @returns {Promise<boolean>} - Promesa que resuelve en `true` si el socket está en el canal, o `false` en caso contrario.
 */
async function isSocketInChannel(channel, socket) {
    try {
        let requester = socket.request.session.user._id;
        let query = await db.findChannelWM("_id", channel);
        if (query.participants.includes(requester)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

module.exports = {
    requireLogin,
    requireLogout,
    parseChannelsData,
    isSocketInChannel,
};