const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const backupChargerTableName = "backupcharger";

const BackupChargerSchema = new Schema(
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

const BackupChargerModel = mongoose.model(backupChargerTableName, BackupChargerSchema);

module.exports = { BackupChargerModel, backupChargerTableName };
