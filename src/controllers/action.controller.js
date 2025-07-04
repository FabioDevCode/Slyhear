import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const trackDir = path.join(__dirname, "..", "upload", "sounds");
const imagesDir = path.join(__dirname, "..", "upload", "images");

import models from "../models/index.js";

import { generateCookie } from "../helpers/user.helpers.js";
import { generateAlphaNum } from '../utils/string.utils.js';

const jobs = {}; // JobId -> { status, logs }

export const goDownload = async(req, res) => {
	try {
		const jobId = generateAlphaNum(32);

		jobs[jobId] = {
			status: 'started',
			logs: [],
		};

		const child = fork(path.join(__dirname, '../workers/downloadChildTask.js'));

		child.on('message', (msg) => {
			if (msg.type === 'log') {
				jobs[jobId].logs.push(msg.data);
			} else if (msg.type === 'status') {
				jobs[jobId].status = msg.data;
			}
		});

		child.on('exit', (code) => {
			if (code === 0) {
				jobs[jobId].status = 'finished';
			} else {
				jobs[jobId].status = 'error';
				jobs[jobId].logs.push(`Exited with code ${code}`);
			}
		});

		child.send({ jobId });

		res.status(200).json({
			ok: true,
			jobId
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};

export const getJobProgress = (req, res) => {
	const { jobId } = req.params;
	const job = jobs[jobId];

	if (!job) {
		return res.status(404).json({ status: 'not_found' });
	}

	res.json({
		status: job.status,
		logs: job.logs,
	});
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

		const { mp3Path, imagePath } = await models.Tracks.findOne({
			raw: true,
			where: { id },
			attributes: ["mp3Path", "imagePath"]
		});

		const fileMp3Path = path.join(trackDir, mp3Path);
		const fileImagePath = path.join(imagesDir, imagePath);

		await fs.promises.rm(fileMp3Path, { force: true });
		await fs.promises.rm(fileImagePath, { force: true });

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
			user = await models.User.create({
				login,
				password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
				activated: true,
				isAdmin: true
			});

			cookie = generateCookie(user);
		}

		if(newUser) {
			// Première connexion d'un user crée par l'Admin

			// Si première connexion
			// récupérer l'id (NE DOIS PAS ETRE 1)
		}

		if(!firstUser && !newUser) {
			// Login classque
			user = await models.User.findOne({
				where: {
					login: login
				}
			});

			if(user && bcrypt.compareSync(password, user?.password)) {
				cookie = generateCookie(user);
			} else {
				throw new Error("Mauvais login ou mot de passe.");
			}
		}

		res.status(200).json({cookie})
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};

// Penser a faire une route permettant de créer un user en tant qu'admin

export const add_list = async(req, res) => {
	const { url, title } = req.body;

	try {
		if(!url || !title) {
			return res.status(400).json({});
		}

		const link = await models.List.create({
			url,
			title
		});

		res.status(200).json({
			link
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};

export const remove_list = async(req, res) => {
	try {
		const { id } = req.params;

		if(id) {
			await models.List.destroy({
				where: { id }
			});
		}

		res.status(200).json({});
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};

export const new_playlist = async(req, res) => {
	const { title, trackIds } = req.body;

	try {
		const playlist = await models.Playlists.create({
			title,
			userId: req.user.id,
			trackIds,
		});

		console.log(playlist);

		res.status(200).json({
			message: "OK"
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({});
	}
};