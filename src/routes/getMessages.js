module.exports = (app, db) => {
    //GET
    app.get("/messages", async (req, res) => {
		// if (!req.session.user) return res.status(401).json({ error: "Usuario no autenticado." });
        try {
            const { channel, limit, offset } = req.query;
            const messages = await db.getMessages(channel, limit, offset);
            res.status(200).json(messages);
        } catch (error) {
            console.error(`Error al obtener los mensajes del canal con la id "${channel}": \n${error}`);
            res.status(500).json({message: "Error al obtener los mensajes" });
        }
    });
};