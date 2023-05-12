const express = require('express');
const router = express.Router();

const phoneController = require('../app/controllers/phoneController');

router.get('/:slug/edit', phoneController.edit);
router.get('/create', phoneController.create);
router.get('/:slug', phoneController.show);

module.exports = router;
