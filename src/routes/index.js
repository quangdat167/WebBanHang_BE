const siteRouter = require("./site");
const phonesRouter = require("./phones");
const phoneRouter = require("./phone.route");
const authRouter = require("./auth.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");

function route(app) {
    app.use("/phones", phonesRouter);
    app.use("/api", phoneRouter);
    app.use("/api", authRouter);
    app.use("/api", cartRouter);
    app.use("/api", orderRouter);
    app.use("/", siteRouter);
}

module.exports = route;
