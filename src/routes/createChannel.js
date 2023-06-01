module.exports = (app, db, parseChannelsData, fs, path, io) => {
    //POST
    app.post("/createChannel", async (req, res) => {
        const user = req.session.user;
        if(!user) return
        let { name, description, photo, participants } = req.body;

        participants.push(req.session.user.email);
        const uniqueParticipants = participants.filter((participant, index) => {
            return participants.indexOf(participant) === index;
        });
    
        if (uniqueParticipants.length < 2 || !name) return res.status(400).json({message: "El nombre del canal y los participantes son requeridos."}); 
        if (name.length > 70) return res.status(400).json({message: "El nombre del grupo no puede tener más de 70 caracteres."});
        if (description && description.length > 200)return res.status(400).json({message: "La descripción del grupo no puede tener más de 200 caracteres."});
        if (photo) {
            if (!/^data:image\/[A-Za-z]+;base64,/.test(photo)) return res.status(400).json({ message: "El archivo enviado no es una imagen." });

            const imageType = photo.split(";")[0].split("/")[1];
            const binary = Buffer.from(photo.split(",")[1], "base64");
            const imageFileName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.${imageType}`;
            const imagePath = path.resolve(__dirname, "../Images", imageFileName);

            try {
                await fs.promises.writeFile(imagePath, binary, "binary");
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error al guardar la imagen." });
            }
            photo = `Images/${imageFileName}`;
        }
          
        let participantsIds = [];
    
        try {
            for (const participant of uniqueParticipants) {
                const query = await db.findUser("email", participant);
                if (!query) return res.status(404).json({message: `El participante ${participant} no existe en la base de datos.`});
                participantsIds.push(query._id);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Error al encontrar los participantes en la base de datos."});
        }

        try {
            const createdChannel = await db.createChannel(name, description, photo, participantsIds);
            const parsedChannel = await parseChannelsData([createdChannel]);
            const dataObject = {
                type: "channel",
                channels: parsedChannel,
            };
            for (const participant of participantsIds) {
                io.to(participant.toString()).emit("renderData", dataObject);
            }
            res.status(200).json({success: true, message: "Se ha creado el canal exitosamente."});
            console.log(`Nuevo canal creado : ${name}`)
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Error al crear el canal en la base de datos."});
        }
    });
};