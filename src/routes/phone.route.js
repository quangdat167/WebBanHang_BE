const express = require("express");
const router = express.Router();

const phoneController = require("../app/controllers/phoneController");
const APIConfig = require("../util/APIConfig");

// Phones
router.get(APIConfig.GET_ALL_PHONES, phoneController.getAll);
router.post(APIConfig.GET_PHONE_BY_SLUG, phoneController.getBySlug);
router.post(APIConfig.SEARCH_PHONE_BY_NAME, phoneController.searchByName);
router.post(APIConfig.GET_RANDOM_PHONE, phoneController.getRandomPhone);
router.post(APIConfig.FILTER_PHONE, phoneController.filterPhone);

// Authentications

module.exports = router;
