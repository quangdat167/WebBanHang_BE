const express = require("express");

const APIConfig = require("../util/APIConfig");
const FrequentController = require("../app/controllers/FrequentController");
const router = express.Router();

router.post(APIConfig.CALCULATE_FREQUENT_FPGROWTH, FrequentController.calculateFrequentFPGrowth);
router.post(APIConfig.CALCULATE_FREQUENT_APRIORI, FrequentController.calculateFrequentApriori);
router.post(APIConfig.GET_ALL_FREQUENT, FrequentController.getAllFrequent);
router.post(APIConfig.APPLY_FPGROWTH, FrequentController.applyFPGrowth);
router.post(APIConfig.APPLY_APRIORI, FrequentController.applyApriori);

module.exports = router;
