const { PhoneModel } = require("../models/phone");
const { monggoseToObject, multipleMongooseToObject } = require("../../util/monggoose");
const Config = require("../../util/Config");
const { BackupChargerModel } = require("../models/backupcharger");
const { AdapterModel } = require("../models/adapter");
const { CapbleModel } = require("../models/capble");
const { CaseModel } = require("../models/case");
const { GlassModel } = require("../models/glass");
// const ConfigPhoneBeforeSave = require('../../public/js/ConfigPhoneBeforeSave');

class ItemsController {
    async getBackupCharge(req, res) {
        try {
            const { limit, skip, sortby } = req.body;
            const pipeline = [];
            const totalBackupCharges = await BackupChargerModel.countDocuments();
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await BackupChargerModel.aggregate(pipeline);

            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalBackupCharges - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getAdapter(req, res) {
        try {
            const { limit, skip, sortby } = req.body;
            const pipeline = [];
            const totalBackupCharges = await AdapterModel.countDocuments();
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await AdapterModel.aggregate(pipeline);

            // Trả về kết quả và số lượng còn lại
            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalBackupCharges - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getCable(req, res) {
        try {
            const { limit, skip, sortby } = req.body;
            const pipeline = [];
            const totalBackupCharges = await CapbleModel.countDocuments();
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await CapbleModel.aggregate(pipeline);

            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalBackupCharges - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getCase(req, res) {
        try {
            const { limit, skip, sortby } = req.body;
            const pipeline = [];
            const totalBackupCharges = await CaseModel.countDocuments();
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await CaseModel.aggregate(pipeline);

            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalBackupCharges - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getGlass(req, res) {
        try {
            const { limit, skip, sortby } = req.body;
            const pipeline = [];
            const totalBackupCharges = await GlassModel.countDocuments();
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await GlassModel.aggregate(pipeline);

            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalBackupCharges - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }

    async searchByName(req, res) {
        try {
            const { keyword } = req.body;
            const phones = await BackupChargerModel.find({ name: new RegExp(keyword, "i") }).sort({
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
            const phones = await BackupChargerModel.aggregate([
                { $sample: { size: parseInt(limit) } },
            ]);
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

module.exports = new ItemsController();
