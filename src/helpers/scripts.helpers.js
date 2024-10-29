import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScriptPath = path.resolve(__dirname, "../scripts/downloadSounds.py");

export async function downloadFromPython(urls) {
    const pythonProcess = spawn("python3", [pythonScriptPath, ...urls]);
    let result = "";

	return new Promise((resolve, reject) => {
		// Écouter et afficher la sortie en temps réel
		pythonProcess.stdout.on("data", (data) => {
            const str_out = data.toString();
            if(str_out.includes('download')) {
                console.log(str_out);
            }
            result = str_out;
		});

		// Écouter et afficher les erreurs en temps réel
		pythonProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data.toString()}`);
		});

		// Quand le processus se termine
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

// Utilisation ---------- En ligne de commande pour tester
const urls = [
	"https://www.youtube.com/watch?v=V62xgYWKnJQ"
];

(async () => {
	try {
		const downloadedUrls = await downloadFromPython(urls);
		console.log("URLs téléchargées :", downloadedUrls);
	} catch (error) {
		console.error("Erreur lors de l'exécution :", error);
	}
})();
