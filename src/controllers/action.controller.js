import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const trackDir = path.join(__dirname, "..", "upload", "sounds");

import models from "../models/index.js";
import { downloadFromPython, formatedDataForDB, sanatizeUrl } from "../helpers/scripts.helpers.js";
import { downloadImagesFromUrls } from "../scripts/downloadImages.js";
import { generateCookie } from "../helpers/user.helpers.js";


export const goDownload = async (req, res) => {
	try {
		const { list } = req.body;
		const urls = sanatizeUrl(list);

		const sounds = await downloadFromPython(urls);
		const images = await downloadImagesFromUrls(urls);

		const preparedData = await formatedDataForDB({ list, sounds, images });

		await models.Tracks.bulkCreate(preparedData);

		res.status(200).json({
			ok: true
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};

export const setStream = async(req, res) => {
	try {
		const { code } = req.params;
		const filePath = path.join(trackDir, `${code}.mp3`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: 'Fichier introuvable' });
		}

		const stat = fs.statSync(filePath);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (!range) {
			// Si pas de range, envoyer le fichier entier
			res.writeHead(200, {
				'Content-Type': 'audio/mpeg',
				'Content-Length': fileSize,
				'Accept-Ranges': 'bytes',
			});
			fs.createReadStream(filePath).pipe(res);
		} else {
			// Si range est demandé, gérer la requête partielle
			const parts = range.replace(/bytes=/, '').split('-');
			const start = Number.parseInt(parts[0], 10);
			const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;

			// Vérifier la validité des indices
			if (start >= fileSize || end >= fileSize) {
				return res.status(416).send('Requested range not satisfiable');
			}

			const chunkSize = end - start + 1;
			const readStream = fs.createReadStream(filePath, { start, end });

			res.writeHead(206, {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Content-Length': chunkSize,
				'Content-Type': 'audio/mpeg',
				'Accept-Ranges': 'bytes',
			});

			// Envoyer le flux de données partiel
			readStream.pipe(res);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			error: err
		});
	}
};

export const deleteSound = async(req, res) => {
	try {
		const { id } = req.params;

		function isValidId(id) {
			return Number.isInteger(Number(id));
		}

		if(!isValidId(id)) {
			throw new Error("Missing ID");
		}

		await models.Tracks.destroy({
			where: { id }
		})

		res.status(200).json({
			ok: true
		})
	} catch (err) {
		console.error(err);
		res.status(200).json({});
	}
};

export const login = async(req, res) => {
	const { firstUser, login, password, confirm_password, newUser } = req.body;
	let user;
	let cookie = "slyhear";

	try {
		if(firstUser) {
			// Only for first user is Admin

			// user = await models.User.create({
			// 	login,
			// 	password,
			// 	activated: true,
			// 	isAdmin: true
			// });

			user = {
				login,
				password,
				activated: true,
				isAdmin: true
			}

			cookie = generateCookie(user);
		}

		if(newUser) {
			// Première connexion d'un user crée par l'Admin

			// Si première connexion
			// récupérer l'id (NE DOIS PAS ETRE 1)
		}

		if(!firstUser && !newUser) {
			// Login classque
		}


		console.log("req.body : ", req.body);


		res.status(200).json({cookie})
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
}

// Penser a faire une route permettant de créer un user en tant qu'admin