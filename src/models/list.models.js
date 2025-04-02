import { createRequire } from "node:module";
import * as builder from "../helpers/models.helpers.js";
const attributes = createRequire(import.meta.url)(
    "./attributes/list.attributes.json",
);
const relations = createRequire(import.meta.url)(
    "./relations/list.relations.json",
);

export default function (sequelize) {
    const attributes_build = builder.buildAttributes(attributes);
    const options = {
        sequelize,
        tableName: "list",
        timestamps: true,
        indexes: builder.buildIndexes(attributes),
    };

    const Model = sequelize.define("List", attributes_build, options);
    Model.associate = builder.buildRelations("List", relations);

    return Model;
}