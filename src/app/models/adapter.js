const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const adapterTableName = "adapter";

const AdapterSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, slug: "name", unique: true },
        image: String,
        price: Number,
        promotion: { type: Array },
        technical_infos: Array,
        brand: String,
        information: String,
        colors: Array,
        // description: Array,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const AdapterModel = mongoose.model(adapterTableName, AdapterSchema);

module.exports = { AdapterModel, adapterTableName };
