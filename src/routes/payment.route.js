const express = require("express");

const APIConfig = require("../util/APIConfig");
const PaymenController = require("../app/controllers/PaymentController");
const router = express.Router();

router.post(APIConfig.GET_PAYMENT_LINK, PaymenController.getPaymentLink);

module.exports = router;
