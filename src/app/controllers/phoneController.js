const { PhoneModel } = require('../models/Phones');
const { monggoseToObject, multipleMongooseToObject } = require('../../util/monggoose');
// const ConfigPhoneBeforeSave = require('../../public/js/ConfigPhoneBeforeSave');

class PhoneController {
    // Get API

    // [GET] /api/phones
    getAll(req, res, next) {
        PhoneModel.find({})
            .then(phones => {
                res.json(phones);
            })
            .catch(next);
    }

    // [GET] /api/phones/:slug
    async getBySlug(req, res) {
        try {
            const phone = await PhoneModel.findOne({ slug: req.body.slug });
            if (phone) {
                // console.log(phone);
                res.status(200).json(phone);
            } else res.status(200).json({ message: 'Invalid phone' });
        } catch (err) {
            console.log(err);
        }
    }

    // Show in backend

    // [GET] /phones/create
    create(req, res, next) {
        res.render('phones/create');
    }

    // [GET] /phones/:slug
    show(req, res, next) {
        let firstImage;
        PhoneModel.findOne({ slug: req.params.slug })
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
        const phone = new PhoneModel(req.body);
        phone
            .save()
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }

    // [GET] /phones/:id/edit
    edit(req, res, next) {
        PhoneModel.findById(req.params.id)
            .then(phone => {
                res.render('phones/edit', {
                    phone: monggoseToObject(phone),
                });
            })
            .catch(next);
    }

    // [PUT] /phones/:id
    update(req, res, next) {
        PhoneModel.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }

    // [GET] /phones/list
    read(req, res, next) {
        PhoneModel.find()
            .then(phones => {
                res.render('phones/list', { phones: multipleMongooseToObject(phones) });
            })
            .catch(next);
    }

    // [DELETE] /phones/:id
    delete(req, res, next) {
        PhoneModel.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('/phones/list');
            })
            .catch(next);
    }

    async searchByName(req, res) {
        try {
            const { keyword } = req.body;
            const phones = await PhoneModel.find({ name: new RegExp(keyword, 'i') });
            res.status(200).json(phones);
        } catch (err) {
            console.log(err);
        }
    }

    async getRandomPhone(req, res) {
        try {
            const { limit } = req.body;
            const phones = await PhoneModel.aggregate([{ $sample: { size: parseInt(limit) } }]);
            res.status(200).json(phones);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new PhoneController();
