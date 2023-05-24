const express = require('express');
const router = express.Router();

const apiController = require('../app/controllers/apiController');

router.get('/products', apiController.index);

module.exports = router;
