// Inicializar el servidor express y requerir dependencias
const config = require("../config.js");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const db = require("./db.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { requireLogin, requireLogout, parseChannelsData, isSocketInChannel } = require("./functions.js");
const SocketIO = require("socket.io");

// Usar express-sesion para manejar las sesiones
const sessionMiddleware = session({
	secret: config.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
});

app.use(sessionMiddleware);

// Establecer las rutas base para los archivos estáticos
app.use("/Files", express.static(path.join(__dirname, "Files")));
app.use(express.static(path.join(__dirname, "public")));

// Parsear los datos de las solicitudes POST.
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Inicializar el servidor y establecer Socket.IO
const server = app.listen(config.PORT, "0.0.0.0", () => {
	console.log(`Servidor Express funcionando en http://0.0.0.0:${config.PORT}`);
});
const io = SocketIO(server);

// Rutas
require("./routes/chat")(app, path, requireLogout);
require("./routes/createChannel")(app, db, parseChannelsData, fs, path, io);
require("./routes/editUser")(app, db, bcrypt, path, fs);
require("./routes/getUser")(app, db, fs, path);
require("./routes/getMessages")(app, db);
require("./routes/login")(app, db, bcrypt, requireLogin, path);
require("./routes/logout")(app);
require("./routes/register")(app, db, bcrypt, requireLogin, path);

// Definir la ruta principal
app.get("/", (req, res) => {
	res.redirect("/login");
});

// Verificar si la carpeta "Images" existe
const imagesFolderPath = path.resolve(__dirname, "../Images");
await fs
	.access(imagesFolderPath)
	.then(() => true)
	.catch(() => fs.mkdir(imagesFolderPath));

//Redefinir las funciones console.log y console.error
const logPath = path.join(__dirname, "logs", "console.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

const logMessage = (message, messageType) => {
	const now = new Date();
	const horaActual = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
	logStream.write(`[${horaActual}] ${message}\n`);
	process[messageType].write(`[${horaActual}] ${message}\n`);
};

console.log = message => logMessage(message, "stdout");
console.error = message => logMessage(message, "stderr");

// Manejar errores
require("./errorHandler.js");

io.use((socket, next) => {
	sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async socket => {
	const user = socket.request.session.user;
	if (!user) return;
	socket.join(user._id);

	let userChannels = await db.findChannels(user._id.toString());
	let parsedChannels = await parseChannelsData(userChannels, socket);
	const dataObject = {
		type: "channel",
		channels: parsedChannels,
	};
	socket.emit("renderData", dataObject);

	socket.on("joinChannel", async channel => {
		if (!isSocketInChannel(channel, socket)) return;
		socket.join(channel);
	});

	socket.on("chat:message", async ({ message, channel }) => {
		if (!isSocketInChannel(channel, socket)) return;
		let message = await db.createMessage(channel, user._id, message);
		const dataObject = {
			type: "message",
			channelId: channel,
			position: "beforeend",
			messages: [{
				id: message._id,
				author: user._id,
				content: message.content,
				date: Date.now(),
			}],
		};
		io.in(channel).emit("renderData", dataObject);
		console.log(`${user.nickname} > ${message.content}`);
	});
});
