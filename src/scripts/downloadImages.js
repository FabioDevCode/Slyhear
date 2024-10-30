import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "..", "upload", "images");


// Fonction pour télécharger une image à partir de l'URL d'une vidéo YouTube
async function downloadImage(url) {
	try {
		// Vérifier si le dossier existe, sinon le créer
		if (!fs.existsSync(imagesDir)) {
			fs.mkdirSync(imagesDir, { recursive: true });
		}

		const videoId = new URL(url).searchParams.get("v");
		const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
		const imagePath = path.join(imagesDir, `${videoId}_temp.jpg`);
		const croppedImagePath = path.join(imagesDir, `${videoId}.jpg`);

		const response = await fetch(imageUrl);
		if (!response.ok) {
			throw new Error(
				`Erreur lors du téléchargement de l'image : ${response.statusText}`,
			);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		fs.writeFileSync(imagePath, buffer);

		// Rognage de l'image pour qu'elle soit carrée
		await sharp(imagePath)
			.resize({
				width: 800,
				height: 800,
				fit: sharp.fit.cover,
				position: sharp.strategy.center,
			})
			.toFile(croppedImagePath);

		// Suppression de l'image originale après rognage
		await fs.promises.unlink(imagePath);

		console.log(`Image téléchargée : ${croppedImagePath}`);

		return {
			name: videoId,
			filePath: croppedImagePath
		}
	} catch (error) {
		console.error(`downloadImage ${url}: ${error.message}`);
		return null
	}
}

// Fonction principale pour parcourir la liste des URLs et télécharger les images
export const downloadImagesFromUrls = async (urls) => {
	const allSoundsImages = []

	for (const url of urls) {
		const soundImage = await downloadImage(url);
		allSoundsImages.push(soundImage);
	}

	console.log("Téléchargement des images terminé.");

	return allSoundsImages;
}

