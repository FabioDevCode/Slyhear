import { preparedTracksToShow } from "../helpers/tracks.helpers.js";
import models from "../models/index.js";

export const index = (req, res) => {
	res.redirect("/player");
};

export const player = (req, res) => {
	res.render("index");
};

export const library = async (req, res) => {
	try {
		const allTracks = await models.Tracks.findAll({
			raw: true,
			attributes: ["id", "title", "imagePath"],
			order: [["title", "ASC"]]
		});

		const tracks = await preparedTracksToShow(allTracks);

		res.render("library", { tracks });
	} catch (err) {
		console.error(err);
		res.redirect("/home");
	}
};

export const upload = (req, res) => {
	res.render("upload");
};

export const download = (req, res) => {
	res.render("download");
};
