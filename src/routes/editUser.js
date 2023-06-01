module.exports = (app, db, bcrypt, path, fs) => {
    //PUT
    app.put("/editUser", async (req, res) => {
        const user = req.session.user;
        if (!req.session.user) return;
        let { photo, nickname, email, password, passwordConfirmation } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validaciones básicas
        if (!nickname || !email) return res.status(400).json({ message: "No puedes tener un apodo o un correo vacío." });
        if (email && !emailRegex.test(email)) return res.status(400).json({ message: "El correo electrónico no es válido." });
        if (password && password.length < 8) return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
        if (password && passwordConfirmation && password !== passwordConfirmation) return res.status(400).json({ message: "Las contraseñas no coinciden." });
        if (user.email != email && (await db.findUser("email", email))) return res.status(400).json({ message: "El correo electrónico ya está registrado." });
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

        try {
            const updateData = {
                photo,
                nickname,
                email,
            };

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.passwordHash = hashedPassword;
            }

            await db.updateUser(user._id, updateData);

            req.session.user = {
                ...req.session.user,
                ...updateData,
            };

            res.status(200).json({ success: true, message: "Se ha actualizado el usuario exitosamente." });
            console.log(`Se ha actualizado el usuario con el email ${email}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al actualizar el usuario en la base de datos." });
        }
    });
};
