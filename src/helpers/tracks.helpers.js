import fs from "node:fs";
import path, { parse } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "..", "upload", "images");
// const soundsDir = path.join(__dirname, "..", "upload", "sounds");

export const preparedTracksToShow = (arrayTracks) => {
	if (!Array.isArray(arrayTracks)) return [];

	return arrayTracks.map((track) => ({
		id: track?.id,
		title: track?.title,
		songId: track?.videoId,
		color: track?.mainColor,
		imgPath: track?.imagePath ? `/sm/${track.imagePath}` : '/sm/_default.jpg',
		duration: track?.duration,
	}));
};

export const preparedTracksToPlaylist = (arrayTracks) => {
	if (!Array.isArray(arrayTracks)) return [];

	return arrayTracks.map((track) => ({
		id: track?.id,
		title: track?.title,
		imgPath: track?.imagePath ? `/sm/${track.imagePath}` : '/sm/_default.jpg',
		// trackIds: track?.trackIds ? parse(track?.trackIds) : [],
	}));
};