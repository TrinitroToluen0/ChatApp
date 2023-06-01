const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const uri = "mongodb+srv://Mencoreh:RRyKUSz33lqXgkGm@cluster0.emhsybu.mongodb.net/ChatApp?retryWrites=true&w=majority";
//CONEXIÓN A MONGODB
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("La conexión a MongoDB fue exitosa.");
    })
    .catch((e) => {
        console.log("La conexión a MongoDB falló.", e);
    });

///////////////USER SCHEMA Y MODEL///////////////
const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
        },
        nickname: {
            type: String,
        },
        passwordHash: {
            type: String,
        },
        photo: {
            type: String,
        },
    },
    { versionKey: false }
);

const UserModel = mongoose.model("users", userSchema, "Users");

///////////////CHANNEL SCHEMA Y MODEL///////////////
const channelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "Grupo de ChatApp",
        },
        photo: {
            type: String,
        },
        participants: {
            type: Array,
        },
    },
    { versionKey: false }
);

const ChannelModel = mongoose.model("channel", channelSchema, "Channels");

///////////////MESSAGE SCHEMA Y MODEL///////////////
const messageSchema = mongoose.Schema(
    {
        channel: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    },
    { versionKey: false }
);

const MessageModel = mongoose.model("messages", messageSchema, "Messages");

////////////FUNCIONES////////////

/**
 * Crea un nuevo usuario.
 * @param {string} nickname - Nombre de usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} passwordHash - Hash de la contraseña del usuario.
 * @param {string} profilePicture - URL de la imagen de perfil del usuario.
 * @returns {Promise<object>} - Promesa que resuelve en un objeto con los datos del usuario creado.
 */
async function createUser(nickname, email, passwordHash, profilePicture) {
    const usuario = new UserModel({
        nickname: nickname,
        email: email,
        passwordHash: passwordHash,
        profilePicture: profilePicture,
    });
    const resultado = await usuario.save();
    return resultado;
}

/**
 * Encuentra un usuario por un dato específico.
 * @param {string} key - Clave para buscar el usuario (por ejemplo, "_id", "nickname", "email").
 * @param {string} value - Valor para buscar el usuario.
 * @returns {Promise<object|null>} - Promesa que resuelve en un objeto con los datos del usuario encontrado, o `null` si no se encuentra ningún usuario.
 */
async function findUser(key, value) {
    const resultado = await UserModel.findOne({ [key]: value });
    return resultado;
}

/**
 * Encuentra todos los usuarios.
 * @returns {Promise<Array>} - Promesa que resuelve en un arreglo de objetos con los datos de todos los usuarios.
 */
async function findAllUsers() {
    const resultado = await UserModel.find();
    return resultado;
}

/**
 * Actualiza los datos de un usuario en la base de datos.
 *
 * @param {string} id - El id del usuario a actualizar.
 * @param {object} data - Un objeto con las keys y valores a actualizar en el modelo UserModel.
 * @returns {Promise} - Una promesa que se resuelve con el resultado de la operación de actualización.
 */
async function updateUser(id, updates) {
    const idObject = new ObjectId(id);
    const resultado = await UserModel.updateOne(
        { _id: idObject },
        {
            $set: updates,
        }
    );
    return resultado;
}

/**
 * Elimina un usuario por un dato específico.
 * @param {string} key - Clave para buscar el usuario a eliminar (por ejemplo, "_id", "nickname", "email").
 * @param {string} value - Valor para buscar el usuario a eliminar.
 * @returns {Promise<object>} - Promesa que resuelve en un objeto con los detalles de la eliminación.
 */
async function deleteUser(key, value) {
    const resultado = await UserModel.deleteOne({ [key]: value });
    return resultado;
}

/**
 * Crea un nuevo canal.
 * @param {string} name - Nombre del canal.
 * @param {string} description - Descripción del canal.
 * @param {string} photo - URL de la foto del canal.
 * @param {Array} participants - Participantes del canal.
 * @param {Array} messages - Mensajes del canal.
 * @returns {Promise<object>} - Promesa que resuelve en un objeto con los datos del canal creado.
 */
async function createChannel(name, description, photo, participants, messages) {
    const channel = new ChannelModel({
        name: name,
        description: description,
        photo: photo,
        participants: participants,
        messages: messages,
    });
    const resultado = await channel.save();
    return resultado;
}

/**
 * Encuentra un canal por un dato específico.
 * @param {string} key - Clave para buscar el canal (por ejemplo, "_id", "name", "description").
 * @param {string} value - Valor para buscar el canal.
 * @returns {Promise<object|null>} - Promesa que resuelve en un objeto con los datos del canal encontrado, o `null` si no se encuentra ningún canal.
 */
async function findChannel(key, value) {
    const resultado = await ChannelModel.findOne({ [key]: value });
    return resultado;
}

/**
 * Encuentra un canal por un dato específico, sin incluir los mensajes.
 * @param {string} key - Clave para buscar el canal (por ejemplo, "_id", "name", "description").
 * @param {string} value - Valor para buscar el canal.
 * @returns {Promise<object|null>} - Promesa que resuelve en un objeto con los datos del canal encontrado (sin incluir los mensajes), o `null` si no se encuentra ningún canal.
 */
async function findChannelWM(key, value) {
    const resultado = await ChannelModel.findOne({ [key]: value }, { messages: 0 });
    return resultado;
}

/**
 * Encuentra todos los canales en los que el usuario con una ID es participante.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array>} - Promesa que resuelve en un arreglo de objetos con los datos de todos los canales en los que el usuario es participante.
 */
async function findChannels(userId) {
    const idObject = new ObjectId(userId);
    const resultado = await ChannelModel.find({ participants: idObject });
    return resultado;
}

/**
 * Encuentra todos los canales.
 * @returns {Promise<Array>} - Promesa que resuelve en un arreglo de objetos con los datos de todos los canales.
 */
async function findAllChannels() {
    const resultado = await ChannelModel.find();
    return resultado;
}

/**
 * Actualiza los datos de un canal por su ID.
 * @param {string} id - ID del canal a actualizar.
 * @param {string} key - Clave del dato a actualizar (por ejemplo, "name", "description", "photo").
 * @param {any} value - Nuevo valor del dato a actualizar.
 * @returns {Promise<object>} - Promesa que resuelve en un objeto con los detalles de la actualización.
 */
async function updateChannel(id, key, value) {
    const idObject = new ObjectId(id);
    const resultado = await ChannelModel.updateOne(
        { _id: idObject },
        {
            $set: {
                [key]: value,
            },
        }
    );
    return resultado;
}

/**
 * Elimina un canal por un dato específico.
 * @param {string} key - Clave para buscar el canal a eliminar (por ejemplo, "_id", "name", "description").
 * @param {string} value - Valor para buscar el canal a eliminar.
 * @returns {Promise<object>} - Promesa que resuelve en un objeto con los detalles de la eliminación.
 */
async function deleteChannel(key, value) {
    const resultado = await ChannelModel.deleteOne({ [key]: value });
    return resultado;
}

/**
 * Crea un nuevo mensaje en un canal especificado.
 *
 * @param {string} channelID - El ID del canal donde se quiere crear el mensaje.
 * @param {string} authorID - El ID del autor del mensaje.
 * @param {string} content - El contenido del mensaje.
 * @returns {Promise<object>} - Una promesa que devuelve el documento del mensaje creado.
 */
async function createMessage(channelID, authorID, content) {
    const message = new MessageModel({
        channel: channelID,
        author: authorID,
        content: content,
        date: new Date(),
    });
    const resultado = await message.save();
    return resultado;
}

/**
 * Obtiene los mensajes de un canal específico.
 *
 * @param {string} channelId - El ID del canal del cual se obtendrán los mensajes.
 * @param {number} [limit=20] - El número máximo de mensajes a devolver.
 * @param {number} [offset=0] - El número de mensajes a omitir.
 * @returns {Promise<{ channelId: string, messages: { author: string, content: string, date: Date }[] }>} - Un objeto que contiene los últimos mensajes para el canal especificado.
 */
async function getMessages(channelId, limit = 20, offset = 0) {
    try {
        const messages = await MessageModel.find({ channel: channelId })
            .sort({ date: -1 }) // Ordena los mensajes por fecha en orden descendente (los más recientes primero)
            .skip(offset)
            .limit(limit)
            .exec();

        const result = {
            channelId: channelId,
            messages: messages.map((message) => ({
                id: message._id,
                author: message.author,
                content: message.content,
                date: message.date
            })),
        };

        return result;
    } catch (error) {
        console.error(`Error al obtener los mensajes en el canal con la id ${channelId}`)
    }
}

module.exports = {
    createUser,
    findUser,
    findAllUsers,
    updateUser,
    deleteUser,
    createChannel,
    findChannel,
    findChannelWM,
    findChannels,
    findAllChannels,
    updateChannel,
    deleteChannel,
    createMessage,
    getMessages
};