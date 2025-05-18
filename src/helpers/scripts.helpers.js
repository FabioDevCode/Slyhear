import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFile } from "music-metadata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScriptPath = path.resolve(__dirname, "../scripts/downloadSounds.py");


export const prepareListBeforeDl = (baseList) => {
	const formatedList = baseList.map((el) => {
		return {
			...el,
			name: el.url?.split("?v=")[1]?.split('&')[0] || "",
		};
	}).sort((a, b) => a.name.localeCompare(b.name))

	return formatedList;
};

export const sanatizeUrl = (list) => {
	const urls = list.map((el) => {
		try {
			const url = new URL(el.url);
			const hostname = url.hostname.replace("www.", "");

			if (!["youtube.com", "youtu.be"].includes(hostname)) {
				throw new Error("Not a YouTube URL");
			}

			let videoId = url.searchParams.get("v");

			if (!videoId) {
				const pathParts = url.pathname.split("/");
				videoId = pathParts[pathParts.length - 1];
			}

			if (!videoId) throw new Error("ID vidéo introuvable");

            return `https://www.youtube.com/watch?v=${videoId}`;
		} catch (err) {
			console.error(`INVALID URL : ${el.url} `);
			return null;
		}
	}).filter(Boolean);

	return urls;
};

export const downloadFromPython = async (urls) => {
	const pythonProcess = spawn("python3", [pythonScriptPath, ...urls]);
	console.log("Téléchargement des mp3...");
	let result = "";

	return new Promise((resolve, reject) => {
		pythonProcess.stdout.on("data", (data) => {
			const str_out = data.toString();
			if (str_out.includes("download")) {
				// console.log(str_out);
			}
			result = str_out;
		});

		pythonProcess.stderr.on("data", (data) => {
			if(!data.toString().includes('WARNING')) {
				console.error(`stderr: ${data.toString()}`);
			}
		});

		pythonProcess.on("close", (code) => {
			if (code === 0) {
				try {
					const downloads = JSON.parse(result);
					resolve(downloads.sort((a, b) => a.name.localeCompare(b.name))); // Renvoie les URLs téléchargées
				} catch (jsonError) {
					reject(`Erreur de parsing JSON : ${jsonError}`);
				}
			} else {
				reject(`Erreur : ${result}`);
			}
		});
	});
};

export const getDurationSounds = async (soundsName) => {
	try {
		const results = [];

		for (const sound of soundsName) {
			const filePath = path.resolve(__dirname, `../upload/sounds/${sound}.mp3`);

			const metadata = await parseFile(filePath);
			const durationInSeconds = metadata.format.duration;

			// const minutes = Math.floor(durationInSeconds / 60);
			// const seconds = Math.floor(durationInSeconds % 60);
			// const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

			results.push({
				name: sound,
				duration: Number.parseInt(durationInSeconds),
			});
		}

		return results.sort((a, b) => a.name.localeCompare(b.name));
	} catch (err) {
		console.error(`getDurationSounds : ${err}`);
		return null;
	}
};

export const formatedDataForDB = async ({ list, sounds, images }) => {
	try {
		const preparedData = [];
		const duration = await getDurationSounds(list.map((el) => el.name));

		for (let i = 0; i < list.length; i++) {
			const aggragateObj = {
				...duration[i],
				...images[i],
				...sounds[i],
				...list[i],
			};
			preparedData.push({
				videoId: aggragateObj.name,
				title: aggragateObj.title,
				mp3Path: `${aggragateObj.name}.mp3`,
				imagePath: `${aggragateObj.name}.jpg`,
				mainColor: aggragateObj.color.hex,
				duration: aggragateObj.duration,
			});
		}

		return preparedData;
	} catch (err) {
		console.error(`formatedDataForDB : ${err}`);
		return err;
	}
};
