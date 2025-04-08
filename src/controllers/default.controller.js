import models from "../models/index.js";
import { preparedTracksToShow } from "../helpers/tracks.helpers.js";

export const index = async(req, res) => {
	res.render("login", {
		layout: "login",
		firstUser: !(await models.User.count())
	});
};

export const player = async(req, res) => {
	try {
		const allTracks = await models.Tracks.findAll({
			raw: true,
			attributes: ["id", "videoId", "title", "imagePath", "mainColor", "duration"],
			order: [["title", "ASC"]]
		});

		const tracks = await preparedTracksToShow(allTracks);

		res.render("player", {
			tracks
		});
	} catch (err) {
		console.error(err);
		res.render("player");
	}
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
	const data = {
		options: [
            { name: 'Option 1', value: '1', checked: true },
            { name: 'Option 2', value: '2' },
            { name: 'Option 3', value: '3' }
        ]
	}

	res.render("download", data);
};
