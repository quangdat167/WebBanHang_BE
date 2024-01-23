const express = require("express");

const APIConfig = require("../util/APIConfig");
const CartController = require("../app/controllers/CartController");
const OrderController = require("../app/controllers/OrderController");
const router = express.Router();

router.post(APIConfig.CREATE_ORDER, OrderController.createOrder);
router.post(APIConfig.GET_ALL_ORDERS, OrderController.getAllOrderOfUser);
router.post(APIConfig.GET_ALL_ORDERS_APP, OrderController.getAllOrders);

module.exports = router;
