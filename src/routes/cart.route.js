const express = require("express");

const APIConfig = require("../util/APIConfig");
const CartController = require("../app/controllers/CartController");
const router = express.Router();

router.post(APIConfig.ADD_TO_CART, CartController.addToCart);
router.post(APIConfig.GET_CART, CartController.getAllFromCart);
router.post(APIConfig.DELETE_ITEM_FROM_CART, CartController.deleteItemFromCart);

module.exports = router;
