const express = require("express");
const router = express.Router();

const APIConfig = require("../util/APIConfig");
const ItemsController = require("../app/controllers/ItemsController");

router.post(APIConfig.GET_ADAPTER, ItemsController.getAdapter);
router.post(APIConfig.GET_BACKUP_CHARGE, ItemsController.getBackupCharge);
router.post(APIConfig.GET_CAPBLE, ItemsController.getCable);
router.post(APIConfig.GET_CASE, ItemsController.getCase);
router.post(APIConfig.GET_GLASS, ItemsController.getGlass);

module.exports = router;
