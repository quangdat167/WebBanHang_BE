const { DOMAIN, PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY } = process.env;
const PayOS = require("@payos/node");
const { OrderModel } = require("../models/order");
const { ORDER_STATUS } = require("../../util/Config");
const payOS = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY);
class PaymentController {
    async getPaymentLink(req, res) {
        try {
            const { orderId } = req.body;

            const order = {
                amount: 10000,
                description: "Quang Dat phones",
                orderCode: orderId,
                returnUrl: `${DOMAIN}/order`,
                cancelUrl: `${DOMAIN}/`,
            };
            const paymentLink = await payOS.createPaymentLink(order);
            res.json(paymentLink.checkoutUrl);
        } catch (error) {
            console.log("error creating payment", error);
            res.status(500).send("Error creating payment link");
        }
    }
    async recevieHook(req, res) {
        try {
            const { success, data } = req.body;

            // Kiểm tra nếu thanh toán thành công
            if (success) {
                const { orderCode } = data;

                // Tìm và cập nhật đơn hàng trong cơ sở dữ liệu
                const order = await OrderModel.findOneAndUpdate(
                    { orderCode },
                    { status: ORDER_STATUS.PAID },
                    // { new: true },
                );

                if (order) {
                    console.log(`Order ${orderCode} has been updated to paid.`);
                    res.status(200).json({ message: "Order updated successfully" });
                } else {
                    res.status(404).json({ message: "Order not found" });
                }
            } else {
                res.status(400).json({ message: "Payment not successful" });
            }
        } catch (error) {
            console.error("Error updating order:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new PaymentController();
