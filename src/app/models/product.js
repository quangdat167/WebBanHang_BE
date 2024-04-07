const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
// const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
const produceTableName = "product";

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, slug: "name", unique: true },
        brand: String,
        description: Array,
        prices: Array,
        price: Number,
        specifications: Array,
        images: Array,
        promotion: { type: Array },
        colors: Array,
        priority: Number,
        information: String,
        technical_infos: Array,
        type: String,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

// Add plugin
mongoose.plugin(slug);

const ProductModel = mongoose.model(produceTableName, ProductSchema);

module.exports = { ProductModel, produceTableName };
