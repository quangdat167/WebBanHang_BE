const Phone = require('../models/Phones');
const { monggoseToObject, multipleMongooseToObject } = require('../../util/monggoose');
// const ConfigPhoneBeforeSave = require('../../public/js/ConfigPhoneBeforeSave');
const formatBodyPhone = require('../middleware/formatBodyPhone');

class PhoneController {
    // [GET] /phones/create
    create(req, res, next) {
        res.render('phones/create');
    }

    // [GET] /phones/:slug
    show(req, res, next) {
        let firstImage;
        Phone.findOne({ slug: req.params.slug })
            .then(phone => {
                res.render('phones/show', {
                    phone: monggoseToObject(phone),
                    firstImage: phone.images[0],
                });
            })
            .catch(next);
    }

    // [POST] /phones/create
    store(req, res, next) {
        const phone = new Phone(req.body);
        phone
            .save()
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }

    // [GET] /phones/:id/edit
    edit(req, res, next) {
        Phone.findById(req.params.id)
            .then(phone => {
                res.render('phones/edit', {
                    phone: monggoseToObject(phone),
                });
            })
            .catch(next);
    }

    // [PUT] /phones/:id
    update(req, res, next) {
        Phone.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }

    // [GET] /phones/list
    read(req, res, next) {
        Phone.find()
            .then(phones => {
                res.render('phones/list', { phones: multipleMongooseToObject(phones) });
            })
            .catch(next);
    }

    // [DELETE] /phones/:id
    delete(req, res, next) {
        Phone.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }
}

module.exports = new PhoneController();
