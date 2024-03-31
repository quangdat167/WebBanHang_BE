const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { userTableName } = require("./user");
const { phoneTableName } = require("./phone");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const mongoose_delete = require('mongoose-delete');

const cartTableName = "cart";

const CartSchema = new Schema(
    {
        userId: { type: ObjectId, ref: userTableName },
        products: [
            {
                phoneId: { type: ObjectId, ref: phoneTableName },
                color: { type: String },
                quantity: { type: Number },
                type: { type: String },
            },
        ],
    },
    {
        versionKey: false,
    },
);

const CartModel = mongoose.model(cartTableName, CartSchema);

module.exports = { CartModel, cartTableName };
