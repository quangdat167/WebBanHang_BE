const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userTableName = 'userinfo';

const UserInfoSchema = new Schema(
    {
        password: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        password: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String },
        role: { type: Number },
        address: { type: String },
        phone: { type: String },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const UserInfoModel = mongoose.model(userTableName, UserInfoSchema);

module.exports = { UserInfoModel, userTableName };
