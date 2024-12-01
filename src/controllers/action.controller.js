import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const trackDir = path.join(__dirname, "..", "upload", "sounds");

import models from "../models/index.js";
import { downloadFromPython, formatedDataForDB } from "../helpers/scripts.helpers.js";
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


export const getTrackData = async(req, res) => {
	try {
		const { track } = req.params;

		const filePath = path.join(trackDir, `${track}.mp3`);
		if(!fs.existsSync(filePath)) {
			throw "Audio introuvalbe"
		}

		res.sendFile(filePath);
	} catch (err) {
		console.error(err);
		res.status(200).json({});
	}
}