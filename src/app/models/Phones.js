const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
// const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Phone = new Schema(
    {
        name: { type: String, required: true },
        brand: String,
        description: Array,
        prices: Array,
        specifications: Array,
        images: Array,
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

// Format timestamp khi lưu 1 phone vào db
// Phone.pre('save', function (next) {
//     const now = new Date();
//     const timestamp = now.getTime();
//     const formattedDate = moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
//     this.updatedAt = formattedDate;
//     if (!this.createdAt) {
//         this.createdAt = this.updatedAt;
//     }
//     next();
// });

module.exports = mongoose.model('Phone', Phone);
