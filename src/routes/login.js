module.exports = (app, db, bcrypt, requireLogin, path) => {

    app.get("/login", requireLogin, (req, res) => {
        res.render(path.join(__dirname, "../views/login"));
    });

    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const query = await db.findUser("email", email);

        // Validaciones básicas
        if (!email || !password) return res.status(400).json({ message: "Todos los campos son requeridos." });
        if (!query) return res.status(401).json({ message: "No existe una cuenta con esos datos." });

        // Validar la contraseña
        bcrypt.compare(password, query.passwordHash, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Hubo un error en el servidor." });
            }
            if (result === true) {
                req.session.user = query;
                res.status(200).json({ success: true, message: "Inicio de sesión exitoso." });
                console.log(`El usuario ${query.email} ha iniciado sesión.`);
            } else {
                return res.status(401).json({ message: "El correo electrónico o la contraseña son incorrectos." });
            }
        });
    });
};