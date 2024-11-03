import { createRequire } from "node:module";
import * as builder from "../helpers/models.helpers.js";
const attributes = createRequire(import.meta.url)(
	"./attributes/settings.attributes.json",
);
const relations = createRequire(import.meta.url)(
	"./relations/settings.relations.json",
);

export default function (sequelize) {
	const attributes_build = builder.buildAttributes(attributes);
    const options = {
		sequelize,
		tableName: "settings",
		timestamps: true,
		indexes: builder.buildIndexes(attributes),
	};

    const Model = sequelize.define("Settings", attributes_build, options);
    Model.associate = builder.buildRelations("Settings", relations);

    return Model;
}