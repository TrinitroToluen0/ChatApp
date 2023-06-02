module.exports = app => {
	app.get("/logout", (req, res) => {
		if (!req.session.user) return;
		const email = req.session.user.email;
		req.session.destroy(error => {
			if (error) {
				console.error(error);
			} else {
				if (typeof email !== "undefined") console.log(`El usuario ${email} ha cerrado sesión`);
				res.redirect("/login");
			}
		});
	});
};
