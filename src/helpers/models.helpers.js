import { DataTypes, Sequelize } from "sequelize";
import * as stringUtils from "../utils/string.utils.js";

export const buildAttributes = (attributes) => {
	const object = {};
	for (const prop in attributes) {
		const currentValue = attributes[prop];
		if (typeof currentValue === "object" && currentValue != null) {
			switch (currentValue.type) {
				default:
					object[prop] = { ...currentValue };
					object[prop].type = DataTypes[currentValue.type];
					break;
			}
		}
	}
	return object;
};

export const buildIndexes = (attributes) => {
	const indexes = [];
	for (const key in attributes) {
		if (
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			attributes.hasOwnProperty(key) &&
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			attributes[key].hasOwnProperty("primaryKey") &&
			attributes[key].primaryKey
		) {
			indexes.push({
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: key }],
			});
		}
	}
	return indexes;
};

export const buildRelations = (modelName, relations) => {
	return (models) => {
		for (const association of relations) {
			const modelOptions = {
				allowNull: true,
				...association,
			};

			models[modelName][association.relation](
				models[stringUtils.capitalizeFirstLetter(association.target)],
				modelOptions,
			);
		}
	};
};
