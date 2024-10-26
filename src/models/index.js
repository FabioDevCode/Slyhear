import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Op, Sequelize } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.join(__dirname, "../database/db.sqlite"),
	logging: false,
	define: {
		timestamps: true,
	},
});

const models = {
	Sequelize,
	sequelize,
	Op,
};

const importModel = async (filePath) => {
	const { default: modelImporter } = await import(filePath);
	return modelImporter(sequelize);
};

const modelFiles = fs
	.readdirSync(__dirname)
	.filter((file) => file.endsWith(".models.js"));

for (const file of modelFiles) {
	const model = await importModel(path.join(__dirname, file));
	models[model.name] = model;
}

export default models;
