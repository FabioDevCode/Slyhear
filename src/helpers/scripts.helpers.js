import { spawn } from "node:child_process";
import { parseFile } from 'music-metadata';
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScriptPath = path.resolve(__dirname, "../scripts/downloadSounds.py");


export const downloadFromPython = async (urls) => {
	const pythonProcess = spawn("python3", [pythonScriptPath, ...urls]);
    let result = "";

	return new Promise((resolve, reject) => {
		pythonProcess.stdout.on("data", (data) => {
            const str_out = data.toString();
            if(str_out.includes('download')) {
                // console.log(str_out);
            }
            result = str_out;
		});

		pythonProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data.toString()}`);
		});

		pythonProcess.on("close", (code) => {
			if (code === 0) {
				try {
					const downloads = JSON.parse(result);
					resolve(downloads); // Renvoie les URLs téléchargées
				} catch (jsonError) {
					reject(`Erreur de parsing JSON : ${jsonError}`);
				}
			} else {
				reject(`Erreur : ${result}`);
			}
		});
	});
}

export const getDurationSounds = async(soundsName) => {
	try {
		const results = [];

		for (const sound of soundsName) {
			const filePath = path.resolve(__dirname, `../upload/sounds/${sound}.mp3`);

			const metadata = await parseFile(filePath);
			const durationInSeconds = metadata.format.duration;

			const minutes = Math.floor(durationInSeconds / 60);
			const seconds = Math.floor(durationInSeconds % 60);
			const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

			results.push({
				name: sound,
				duration: formattedDuration,
			});
		}

		return results;
	} catch (err) {
		console.error(`getDurationSounds : ${err}`);
        return null;
	}
}