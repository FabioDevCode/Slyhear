export const index = (req, res) => {
	res.redirect("/home");
};

export const home = (req, res) => {
	res.render("index");
};

export const library = (req, res) => {
	res.render("library");
};

export const upload = (req, res) => {
	res.render("upload");
}

export const download = (req, res) => {
	res.render("download");
};
