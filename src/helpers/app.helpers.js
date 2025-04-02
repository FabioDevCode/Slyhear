import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import * as path from "node:path";

import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { generateAlphaNum } from '../utils/string.utils.js';

export const checkOrCreateConfig = () => {
    // Définition du chemin du fichier
    const configDir = path.join(__dirname, '..', 'config');
    const filePath = path.join(configDir, 'keys.json');

    console.log(filePath)

    // Vérifie si le fichier existe déjà
    if (!existsSync(filePath)) {
        // Créer le dossier "config" s'il n'existe pas
        if (!existsSync(configDir)) {
            mkdirSync(configDir);
        }

        // Générer les clés
        const keys = {
            EV: generateAlphaNum(64),
            IV: generateAlphaNum(32)
        };

        // Écrire dans le fichier JSON
        writeFileSync(filePath, JSON.stringify(keys, null, 2), 'utf-8');
        console.log('Fichier keys.json généré avec succès.');
    }
};