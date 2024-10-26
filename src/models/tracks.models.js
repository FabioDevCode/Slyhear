import { createRequire } from "node:module";
import * as builder from "../helpers/models.helpers.js";
const attributes = createRequire(import.meta.url)(
	"./attributes/tracks.attributes.json",
);
const relations = createRequire(import.meta.url)(
	"./relations/tracks.relations.json",
);

export default function (sequelize) {
	const attributes_build = builder.buildAttributes(attributes);
	const options = {
		sequelize,
		tableName: "tracks",
		timestamps: true,
		indexes: builder.buildIndexes(attributes),
	};

	const Model = sequelize.define("Tracks", attributes_build, options);
	Model.associate = builder.buildRelations("Tracks", relations);

	return Model;
}
