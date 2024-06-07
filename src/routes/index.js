const authRouter = require("./auth.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");
const productRouter = require("./product.route");
const frequentRouter = require("./frequent.route");
const paymentRouter = require("./payment.route");
const PaymentController = require("../app/controllers/PaymentController");

function route(app) {
    app.use("/api", productRouter);
    app.use("/api", authRouter);
    app.use("/api", cartRouter);
    app.use("/api", orderRouter);
    app.use("/api", frequentRouter);
    app.use("/api", paymentRouter);
    app.post("/receive-hook", PaymentController.recevieHook);
}

module.exports = route;
