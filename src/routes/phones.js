const express = require('express');
const router = express.Router();

const phoneController = require('../app/controllers/phoneController');
const formatBodyPhone = require('../app/middleware/formatBodyPhone');

router.put('/:id', formatBodyPhone, phoneController.update);
router.get('/list', phoneController.read);
router.get('/create', phoneController.create);
router.post('/store', formatBodyPhone, phoneController.store);
router.get('/:id/edit', phoneController.edit);
router.delete('/:id', phoneController.delete);
router.get('/:slug', phoneController.show);

module.exports = router;
