const Phone = require('../models/Phones');
const { monggoseToObject } = require('../../util/monggoose');

class PhoneController {
    // [GET] /phones/create
    create(req, res, next) {
        res.render('phones/create');
    }

    // [GET] /phones/:slug
    show(req, res, next) {
        Phone.findOne({ slug: req.params.slug })
            .then(phone => {
                res.render('phones/show', {
                    phone: monggoseToObject(phone),
                });
            })
            .catch(next);
    }

    // [POST] /phones/:slug/edit
    edit(req, res, next) {
        Phone.findOne({ slug: req.params.slug })
            .then(phone => {
                res.render('phones/edit', {
                    phone: monggoseToObject(phone),
                });
            })
            .catch(next);
    }
}

module.exports = new PhoneController();
