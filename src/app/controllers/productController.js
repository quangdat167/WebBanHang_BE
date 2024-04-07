const { ProductModel } = require("../models/product");
const Config = require("../../util/Config");

class ProductController {
    async getProductBySlug(req, res) {
        try {
            const product = await ProductModel.findOne({ slug: req.body.slug });
            if (product) {
                res.status(200).json(product);
            } else res.status(200).json({ message: "Invalid phone" });
        } catch (err) {
            console.log(err);
        }
    }

    async searchByName(req, res) {
        try {
            const { keyword } = req.body;
            const products = await ProductModel.find({ name: new RegExp(keyword, "i") }).sort({
                priority: -1,
            });
            res.status(200).json(products);
        } catch (err) {
            console.log(err);
        }
    }

    async getRandomProduct(req, res) {
        try {
            const { limit } = req.body;
            const products = await ProductModel.aggregate([{ $sample: { size: parseInt(limit) } }]);
            res.status(200).json(products);
        } catch (err) {
            console.log(err);
        }
    }

    async filterPhone(req, res) {
        try {
            const { brand, price, type, ram, rom, charging_feature, sortby, skip, limit } =
                req.body;
            const totalPhones = await ProductModel.countDocuments({ type: "phone" });
            const pipeline = [{ $match: { type: "phone" } }];

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
            const totalPhone = await ProductModel.aggregate([
                ...pipeline,
                { $count: "totalPhone" },
            ]);
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const result = await ProductModel.aggregate(pipeline);

            res.status(200).json({
                phones: result,
                totalPhone: totalPhone.length > 0 ? totalPhone[0].totalPhone : 0,
                totalRemaining:
                    totalPhone.length > 0 ? totalPhone[0].totalPhone - (skip + result.length) : 0,
            });
        } catch (err) {
            console.log(err);
        }
    }

    // Items
    async getProductsItem(req, res) {
        try {
            const { limit, skip, sortby, type } = req.body;
            const pipeline = [{ $match: { type } }];
            const totalItemsType = await ProductModel.countDocuments({ type });
            if (sortby === Config.SORT_BY.PRICE_DESC || sortby === Config.SORT_BY.PRICE_ASC) {
                pipeline.push({
                    $sort: {
                        price: sortby === Config.SORT_BY.PRICE_ASC ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
            const backupCharges = await ProductModel.aggregate(pipeline);

            res.status(200).json({
                data: backupCharges,
                totalRemaining: totalItemsType - (skip + backupCharges.length),
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProductController();
