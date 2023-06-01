module.exports = (app, db, bcrypt, requireLogin, path) => {
    //GET
    app.get("/register", requireLogin, (req, res) => {
        res.render(path.join(__dirname, "../views/register"));
    });

    //POST
    app.post("/register", async (req, res) => {
        const { nickname, email, password, passwordConfirmation } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nickname || !email || !password || !passwordConfirmation) return res.status(400).json({ message: "Todos los campos son requeridos." });
        if (email && !emailRegex.test(email)) return res.status(400).json({ message: "El correo electrónico debe tener un formato válido." });
        if (password && password.length < 8) return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
        if (password && passwordConfirmation && password !== passwordConfirmation) return res.status(400).json({ message: "Las contraseñas no coinciden." });
        if (await db.findUser("email", email)) return res.status(400).json({ message: "El correo electrónico ya está registrado." });

        // Si no hay un error, encriptar la contraseña y registrar el usuario en la base de datos.
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Hubo un error interno del servidor." });
            } else {
                const query = await db.createUser(nickname, email, hashedPassword);
                req.session.user = query;
                res.status(200).json({ success: true, message: "Registro exitoso." });
                console.log(`Se ha registrado un nuevo usuario con el email ${email}`);
            }
        });
    });
};