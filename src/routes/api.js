const express = require('express');
const router = express.Router();
const passport = require('passport');

const phoneController = require('../app/controllers/phoneController');
const AuthController = require('../app/controllers/AuthController');
const formatBodyPhone = require('../app/middleware/formatBodyPhone');
const passportConfig = require('../app/middleware/passport');

// Phones
router.get('/phones', phoneController.getAll);
router.get('/phones/:slug', phoneController.getBySlug);

// Authentications
router.post('/sign-up', AuthController.signUp);
router.post('/sign-in', passport.authenticate('local', { session: false }), AuthController.signIn);
router.post('/secret', passport.authenticate('jwt', { session: false }), AuthController.secret);

module.exports = router;
