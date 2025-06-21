import { createRequire } from "node:module";
import * as builder from "../helpers/models.helpers.js";
const attributes = createRequire(import.meta.url)(
    "./attributes/playlists.attributes.json",
);
const relations = createRequire(import.meta.url)(
    "./relations/playlists.relations.json",
);

export default function (sequelize) {
    const attributes_build = builder.buildAttributes(attributes);
    const options = {
        sequelize,
        tableName: "playlists",
        timestamps: true,
        indexes: builder.buildIndexes(attributes),
    };

    const Model = sequelize.define("Playlists", attributes_build, options);
    Model.associate = builder.buildRelations("Playlists", relations);

    return Model;
}
