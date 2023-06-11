const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
    },
    {
        timestamps: true,
    },
);

// Hash password before save
User.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordhased = await bcrypt.hash(this.password, salt);
        this.password = passwordhased;
        next();
    } catch (err) {
        next(err);
    }
});

User.methods.isValidPassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        throw new Error(err);
    }
};

module.exports = mongoose.model('User', User);
