import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "..", "upload", "images");

async function downloadImage(url) {
	try {
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
		const { hex, rgb } = await getDominantColor(croppedImagePath);

		return {
			name: videoId,
			status: "success",
			color: {
				hex,
				rgb,
			},
		};
	} catch (error) {
		console.error(`downloadImage ${url}: ${error.message}`);
		return null;
	}
}

async function getDominantColor(imagePath) {
	const buffer = await sharp(imagePath).resize(1, 1).raw().toBuffer();

	const [r, g, b] = buffer;
	const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	const rgbColor = `rgb(${r}, ${g}, ${b})`;

	return { hex: hexColor, rgb: rgbColor };
}

export const downloadImagesFromUrls = async (urls) => {
	const allSoundsImages = [];
	console.log("Téléchargement des images...");

	for (const url of urls) {
		const soundImage = await downloadImage(url);
		allSoundsImages.push(soundImage);
	}

	return allSoundsImages.sort((a, b) => a.name.localeCompare(b.name));
};
