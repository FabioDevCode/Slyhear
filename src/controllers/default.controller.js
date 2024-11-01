import { preparedTracksToShow } from "../helpers/tracks.helpers.js";
import models from "../models/index.js";

export const index = (req, res) => {
	res.redirect("/home");
};

export const home = (req, res) => {
	res.render("index");
};

export const library = async (req, res) => {
	try {
		const allTracks = await models.Tracks.findAll({
			attributes: ["id", "title", "imagePath"],
			raw: true,
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
