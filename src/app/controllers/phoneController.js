const { PhoneModel } = require("../models/phone");
const { monggoseToObject, multipleMongooseToObject } = require("../../util/monggoose");
const Config = require("../../util/Config");
// const ConfigPhoneBeforeSave = require('../../public/js/ConfigPhoneBeforeSave');

class PhoneController {
    // Get API

    // [GET] /api/phones
    getAll(req, res, next) {
        PhoneModel.find({})
            .sort({ priority: -1 })
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
            } else res.status(200).json({ message: "Invalid phone" });
        } catch (err) {
            console.log(err);
        }
    }

    // Show in backend

    // [GET] /phones/create
    create(req, res, next) {
        res.render("phones/create");
    }

    // [GET] /phones/:slug
    show(req, res, next) {
        let firstImage;
        PhoneModel.findOne({ slug: req.params.slug })
            .then(phone => {
                res.render("phones/show", {
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
                res.redirect("/phones/list");
            })
            .catch(next);
    }

    // [GET] /phones/:id/edit
    edit(req, res, next) {
        PhoneModel.findById(req.params.id)
            .then(phone => {
                res.render("phones/edit", {
                    phone: monggoseToObject(phone),
                });
            })
            .catch(next);
    }

    // [PUT] /phones/:id
    update(req, res, next) {
        PhoneModel.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect("/phones/list");
            })
            .catch(next);
    }

    // [GET] /phones/list
    read(req, res, next) {
        PhoneModel.find()
            .then(phones => {
                res.render("phones/list", { phones: multipleMongooseToObject(phones) });
            })
            .catch(next);
    }

    // [DELETE] /phones/:id
    delete(req, res, next) {
        PhoneModel.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect("/phones/list");
            })
            .catch(next);
    }

    async searchByName(req, res) {
        try {
            const { keyword } = req.body;
            const phones = await PhoneModel.find({ name: new RegExp(keyword, "i") }).sort({
                priority: -1,
            });
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

    async filterPhone(req, res) {
        try {
            const { brand, price, type, ram, rom, charging_feature, sortby } = req.body;
            const pipeline = [];

            if (type && type.length > 0) {
                if (type.includes("android") && !type.includes("apple")) {
                    pipeline.push({
                        $match: { brand: { $nin: ["apple"] } },
                    });
                } else if (type.includes("apple") && !type.includes("android")) {
                    pipeline.push({
                        $match: { brand: "apple" },
                    });
                }
            }

            if (brand && brand.length > 0) {
                pipeline.push({ $match: { brand: { $in: brand } } });
            }

            if (price && price.length > 0) {
                pipeline.push({
                    $match: {
                        prices: {
                            $elemMatch: {
                                price: {
                                    $gte: price[0] * 1000000,
                                    $lte: price[1] * 1000000,
                                },
                            },
                        },
                    },
                });
            }

            if (ram && ram.length > 0) {
                pipeline.push({
                    $match: {
                        technical_infos: {
                            $elemMatch: {
                                name: "Bộ nhớ & Lưu trữ",
                                details: {
                                    $elemMatch: {
                                        title: "RAM",
                                        infos: { $in: ram },
                                    },
                                },
                            },
                        },
                    },
                });
            }

            if (rom && rom.length > 0) {
                pipeline.push({
                    $match: {
                        technical_infos: {
                            $elemMatch: {
                                name: "Bộ nhớ & Lưu trữ",
                                details: {
                                    $elemMatch: {
                                        title: "Dung lượng lưu trữ",
                                        infos: { $in: rom },
                                    },
                                },
                            },
                        },
                    },
                });
            }

            if (charging_feature && charging_feature.length > 0) {
                // Chuyển đổi chuỗi thành số
                const chargingWattages = charging_feature.map(feature => {
                    const match = feature.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                });

                // Sắp xếp mảng giảm dần
                chargingWattages.sort((a, b) => b - a);

                // Lấy giá trị lớn nhất
                const maxWattage = chargingWattages[0];

                pipeline.push({
                    $match: {
                        technical_infos: {
                            $elemMatch: {
                                name: "Pin & Sạc",
                                details: {
                                    $elemMatch: {
                                        title: "Hỗ trợ sạc tối đa",
                                        infos: {
                                            $gte: `${maxWattage} W`,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (charging_feature.includes("Sạc không dây")) {
                    pipeline.push({
                        $match: {
                            technical_infos: {
                                $elemMatch: {
                                    name: "Pin & Sạc",
                                    details: {
                                        $elemMatch: {
                                            title: "Công nghệ pin",
                                            infos: {
                                                $in: charging_feature,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                }
            }

            if (sortby === Config.SORT_BY.POPULAR || !sortby) {
                pipeline.push({
                    $sort: {
                        priority: -1,
                    },
                });
            } else if (
                sortby === Config.SORT_BY.PRICE_DESC ||
                sortby === Config.SORT_BY.PRICE_ASC
            ) {
                pipeline.push({
                    $addFields: {
                        min_price: { $min: "$prices.price" }, // Tính giá nhỏ nhất trong mảng prices
                    },
                });
                const sortPrice = {
                    $sort: {
                        min_price: sortby === Config.SORT_BY.PRICE_DESC ? -1 : 1, // Sắp xếp giảm dần hoặc tăng dần
                    },
                };

                pipeline.push(sortPrice);
            }
            pipeline.push({ $skip: 0 });
            // pipeline.push({ $limit: 20 });
            const result = await PhoneModel.aggregate(pipeline);
            const totalPhone = result?.length;

            res.status(200).json({ phones: result, totalPhone });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new PhoneController();
