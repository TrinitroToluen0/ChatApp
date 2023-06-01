module.exports = (app, path, requireLogout) => {
    //GET
    app.get("/chat", requireLogout, (req, res) => {
        res.render(path.join(__dirname, "../views/chat"));
    });
};