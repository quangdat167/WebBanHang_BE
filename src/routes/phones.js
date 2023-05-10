const express = require('express');
const router = express.Router();

const phoneController = require('../app/controllers/phoneController');

router.get('/create', phoneController.create);

module.exports = router;
