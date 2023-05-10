const Phone = require('../models/Phones');
const { monggoseToObject } = require('../../util/monggoose');

class PhoneController {
    // [GET] /phones/create
    create(req, res, next) {
        res.render('phones/create');
    }
}

module.exports = new PhoneController();
