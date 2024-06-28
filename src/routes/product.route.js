const express = require("express");
const router = express.Router();

const APIConfig = require("../util/APIConfig");
const productController = require("../app/controllers/productController");

router.post(APIConfig.GET_PRODUCT_BY_SLUG, productController.getProductBySlug);
router.post(APIConfig.GET_PRODUCT_BY_TYPE, productController.getProductsItem);
router.post(APIConfig.SEARCH_PHONE_BY_NAME, productController.searchByName);
router.post(APIConfig.GET_RANDOM_PRODUCT, productController.getRandomProduct);
router.post(APIConfig.FILTER_PHONE, productController.filterPhone);
router.post(APIConfig.GET_FREQUENT_PRODUCTS, productController.getFrequentProduct);
router.get(APIConfig.GET_ALL_PHONES, productController.getAllPhones);

module.exports = router;
