import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "..", "upload", "images");
// const soundsDir = path.join(__dirname, "..", "upload", "sounds");

async function getImageBuffer(imagePath) {
	try {
		const imageBuffer = await fs.promises.readFile(imagePath);
		return imageBuffer;
	} catch (err) {
		return null;
	}
}

export const preparedTracksToShow = async (arrayTracks) => {
	try {
		const tracksWithImages = await Promise.all(
			arrayTracks.map(async (track) => {
				return {
					id: track?.id,
					title: track?.title,
					songId: track?.videoId,
					color: track?.mainColor,
					imgPath: track.imagePath ? `/sm/${track.imagePath}`: '/sm/_default.jpg',
					duration: track?.duration
				};
			}),
		);

		return tracksWithImages;
	} catch (err) {
		console.error(err);
		return err;
	}
};
