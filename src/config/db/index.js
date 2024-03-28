const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
async function connect() {
    try {
        if (DB_USER) {
            await mongoose.connect(
                `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
            );
            console.log("Connect successfully");
        } else {
            await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connect successfully");
        }
    } catch (err) {
        console.log("Connect Fail");
    }
}

module.exports = { connect };
