const Phone = require('../models/Phones');

class apiController {
    // [GET] /api/phones
    index(req, res, next) {
        Phone.find({})
            .then(phones => {
                res.json(phones);
            })
            .catch(next);
    }

    // [GET] /api/phones/:slug
    show(req, res, next) {
        Phone.findOne({ slug: req.params.slug })
            .then(phone => {
                res.json(phone);
            })
            .catch(next);
    }
}

module.exports = new apiController();
