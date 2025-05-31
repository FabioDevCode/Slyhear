import models from "../models/index.js";
import {
	downloadFromPython,
	formatedDataForDB,
	sanatizeUrl,
	prepareListBeforeDl
} from "../helpers/scripts.helpers.js";
import {
    downloadImagesFromUrls
} from "../scripts/downloadImages.js";


process.on('message', async () => {
    try {
        const baseList = await models.List.findAll({
			raw: true,
			attributes: ["url", "title"]
		});

		const list = prepareListBeforeDl(baseList);

		const urls = sanatizeUrl(list);

		const sounds = await downloadFromPython(urls);
		const images = await downloadImagesFromUrls(urls);

		const preparedData = await formatedDataForDB({ list, sounds, images });

		await models.Tracks.bulkCreate(preparedData);
		await models.List.destroy({truncate: true});

        process.send({ status: 'success' });
    } catch (error) {
        console.error('Erreur child_process childTaskNotificationPush :', error);
        process.send({ status: 'error', error: error.message });
    }

    process.exit();
});