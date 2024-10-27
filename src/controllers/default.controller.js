export const index = (req, res) => {
	res.redirect("/home");
}

export const home = (req, res) => {
	res.render("index");
};

export const download = (req, res) => {
	res.render("download");
};