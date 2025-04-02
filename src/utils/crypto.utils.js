import CryptoJS from "crypto-js"
import { readFile } from 'node:fs/promises';

const { EV, IV } = JSON.parse(await readFile(new URL('../config/keys.json', import.meta.url), 'utf8'));


export const encryptObject = (object) => {
    const data = JSON.stringify(object);
    return Buffer.from(CryptoJS.AES.encrypt(data, EV, { iv: IV}).toString()).toString('Hex');
}

export const decryptObject = (object) => {
    const buffer = Buffer.from(object, 'Hex').toString();
    const bytes = CryptoJS.AES.decrypt(buffer, EV, { iv: IV});
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const encryptString = (string) => CryptoJS.AES.encrypt(string, EV, { iv: IV}).toString()

export const decryptString = (string) => CryptoJS.AES.decrypt(string, EV, {iv: IV}).toString(CryptoJS.enc.Utf8)

