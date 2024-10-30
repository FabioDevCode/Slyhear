import models from "../models/index.js";
import {
    downloadFromPython,
    getDurationSounds
} from "../helpers/scripts.helpers.js";
import { downloadImagesFromUrls } from "../scripts/downloadImages.js";


export const goDownload = async (req, res) => {
    try {
        const { list } = req.body;
        const urls = req.body.list.map(el => el.url);
        const soundsName = urls.map(el => el.split('?v=')[1]);

        console.log("====================================");

        console.log(list);
        console.log(urls);
        console.log(soundsName);

        console.log("====================================");

        const pySounds = await downloadFromPython(urls);
        console.log("pyResult : ", pySounds);

        console.log("====================================");

        const duration = await getDurationSounds(soundsName);
        console.log("duration : ", duration);

        console.log("====================================");

        const jsImages = await downloadImagesFromUrls(urls);
        console.log("jsImages : ", jsImages);

        console.log("====================================");

        res.status(200).json({
            msg: "OK"
        })
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
};



