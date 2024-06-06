const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { userTableName } = require("./user");
const { produceTableName } = require("./product");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const mongoose_delete = require('mongoose-delete');

const cartTableName = "cart";

const CartSchema = new Schema(
    {
        userId: { type: ObjectId, ref: userTableName },
        products: [
            {
                productId: { type: ObjectId, ref: produceTableName },
                color: { type: String },
                quantity: { type: Number },
                type: { type: String },
            },
        ],
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const CartModel = mongoose.model(cartTableName, CartSchema);

module.exports = { CartModel, cartTableName };
