const mongoose = require("mongoose");
const { userTableName } = require("./user.model");
const { phoneTableName } = require("./Phones");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const mongoose_delete = require('mongoose-delete');

const orderTableName = "order";

const OrderSchema = new Schema(
    {
        userId: { type: ObjectId, ref: userTableName },
        status: { type: String },
        products: [
            {
                phoneId: { type: ObjectId, ref: phoneTableName },
                color: { type: String },
                quantity: { type: Number },
                type: { type: String },
                price: { type: Number },
            },
        ],
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const OrderModel = mongoose.model(orderTableName, OrderSchema);

module.exports = { OrderModel, orderTableName };
