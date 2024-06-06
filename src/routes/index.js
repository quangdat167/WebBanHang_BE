const authRouter = require("./auth.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");
const productRouter = require("./product.route");
const frequentRouter = require("./frequent.route");

function route(app) {
    app.use("/api", productRouter);
    app.use("/api", authRouter);
    app.use("/api", cartRouter);
    app.use("/api", orderRouter);
    app.use("/api", frequentRouter);
}

module.exports = route;
