const mongoose = require("mongoose");
const { userTableName } = require("./user");
const { produceTableName } = require("./product");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const mongoose_delete = require('mongoose-delete');

const frequentTableName = "frequent";

const FrequentSchema = new Schema(
    {
        productId: { type: ObjectId, ref: produceTableName },
        frequentItems: [
            {
                itemId: { type: ObjectId, ref: produceTableName },
                support: { type: Number },
            },
        ],
        algorithm: String,
        apply: Boolean,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const FrequentModel = mongoose.model(frequentTableName, FrequentSchema);

module.exports = { FrequentModel, frequentTableName };
