const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const caseTableName = "case";

const CaseSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, slug: "name", unique: true },
        image: String,
        price: Number,
        promotion: { type: Array },
        // technical_infos: Array,
        // brand: String,
        // information: String,
        // colors: Array,
        description: Array,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const CaseModel = mongoose.model(caseTableName, CaseSchema);

module.exports = { CaseModel, caseTableName };
