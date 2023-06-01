module.exports = (app, db, fs, path) => {
    //GET
    app.get("/user", async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: "Usuario no autenticado." });

        const queryParams = req.query;
        let key = Object.keys(queryParams)[0];
        let value = queryParams[key];

        if (!key && !value) {
            key = "email";
            value = req.session.user.email;
        }

        let query = await db.findUser(key, value);
        if (!query) return res.status(404).json({ error: "Usuario no encontrado." });

        if (query.photo && fs.existsSync(path.resolve(__dirname, "..", query.photo))) {
            let img = fs.readFileSync(path.resolve(__dirname, "..", query.photo));
            const base64Img = img.toString("base64");
            query.photo = `data:image/png;base64,${base64Img}`;
        } else query.photo = "../Files/sin-foto.png";
        
        return res.status(200).json({
            nickname: query.nickname,
            email: query.email,
            photo: query.photo,
        });
    });
};
