import {
	downloadFromPython,
	formatedDataForDB,
} from "../helpers/scripts.helpers.js";
import models from "../models/index.js";
import { downloadImagesFromUrls } from "../scripts/downloadImages.js";

export const goDownload = async (req, res) => {
	try {
		const { list } = req.body;
		const urls = req.body.list.map((el) => el.url);
		const sounds = await downloadFromPython(urls);
		const images = await downloadImagesFromUrls(urls);

		const preparedData = await formatedDataForDB({ list, sounds, images });

		await models.Tracks.bulkCreate(preparedData);

		res.status(200).json({
			ok: true
		});
	} catch (err) {
		console.error(err);
		res.status(200).json({});
	}
};
