const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
// const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
const phoneTableName = "phone";

const PhoneSchema = new Schema(
    {
        name: { type: String, required: true },
        brand: String,
        description: Array,
        prices: Array,
        specifications: Array,
        images: Array,
        promotion: String,
        colors: Array,
        slug: { type: String, slug: "name", unique: true },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

// Add plugin
mongoose.plugin(slug);

const PhoneModel = mongoose.model(phoneTableName, PhoneSchema);

module.exports = { PhoneModel, phoneTableName };
