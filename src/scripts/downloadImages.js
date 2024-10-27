import fs from "node:fs";
import path from "node:path";
import fetch from 'node-fetch';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), "..", "upload", "images");

const urls = [
	"https://www.youtube.com/watch?v=V62xgYWKnJQ",
	"https://www.youtube.com/watch?v=SL_nGCX4SSs",
	"https://www.youtube.com/watch?v=_81rly0kZTQ",
	"https://www.youtube.com/watch?v=MX8eYdEOU5w"
];


// Fonction pour télécharger une image à partir de l'URL d'une vidéo YouTube
async function downloadImage(url) {
    try {
        const videoId = new URL(url).searchParams.get('v');
        const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const imagePath = path.join(imagesDir, `${videoId}.jpg`);
        const croppedImagePath = path.join(imagesDir, `${videoId}_cropped.jpg`);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement de l'image : ${response.statusText}`);
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
            position: sharp.strategy.center
        })
        .toFile(croppedImagePath);

        // Suppression de l'image originale après rognage
        await fs.promises.unlink(imagePath);

        console.log(`Image téléchargée et rognée : ${croppedImagePath}`);
    } catch (error) {
        console.error(`Erreur lors du téléchargement de l'image pour ${url}: ${error.message}`);
    }
}

// Fonction principale pour parcourir la liste des URLs et télécharger les images
async function downloadImagesFromUrls(urls) {
    for (const url of urls) {
        await downloadImage(url);
    }
    console.log('Téléchargement des images terminé.');
}

// Lancement du téléchargement
downloadImagesFromUrls(urls);