const Phone = require('../models/Phones');

class apiController {
    // [GET] /api/products
    index(req, res, next) {
        Phone.find({})
            .then(phones => {
                res.json(phones);
            })
            .catch(next);
    }
}

module.exports = new apiController();
