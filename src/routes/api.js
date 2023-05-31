const express = require('express');
const router = express.Router();

const apiController = require('../app/controllers/apiController');

router.get('/phones', apiController.index);
router.get('/phones/:slug', apiController.show);

module.exports = router;
