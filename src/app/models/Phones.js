const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
// const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Phone = new Schema(
    {
        name: { type: String, required: true },
        type: String,
        price_display: String,
        description: Array,
        prices: Array,
        specifications: Array,
        images: Array,
        image_title: String,
        promotion: String,
        colors: Array,
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    },
);

// Add plugin
mongoose.plugin(slug);
// Phone.plugin(mongoose_delete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

module.exports = mongoose.model('Phone', Phone);
