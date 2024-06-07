const Config = require("../../util/Config");
const { CartModel } = require("../models/cart");
const { OrderModel } = require("../models/order");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class OrderController {
    async createOrder(req, res) {
        try {
            const { userId, products, orderCode } = req.body;

            const newOrder = await OrderModel.create({
                userId,
                status: Config.ORDER_STATUS.NOT_PAID,
                products,
                orderCode,
            });
            newOrder.save();
            return res.status(200).json(newOrder);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllOrderOfUser(req, res) {
        try {
            const { userId } = req.body;

            const allOrders = await OrderModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId),
                    },
                },

                {
                    $lookup: {
                        from: "products",
                        foreignField: "_id",
                        localField: "products.productId",
                        as: "productInfos",
                    },
                },

                {
                    $addFields: {
                        products: {
                            $map: {
                                input: "$products",
                                as: "product",
                                in: {
                                    $mergeObjects: [
                                        "$$product",
                                        {
                                            productInfo: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$productInfos",
                                                            as: "productInfo",
                                                            cond: {
                                                                $eq: [
                                                                    "$$productInfo._id",
                                                                    "$$product.productId",
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        productInfos: 0,
                    },
                },
            ]);
            return res.status(200).json(allOrders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllOrders(req, res) {
        try {
            const { userId } = req.body;

            const allOrders = await OrderModel.aggregate([
                {
                    $match: {},
                },

                {
                    $lookup: {
                        from: "phones",
                        foreignField: "_id",
                        localField: "products.phoneId",
                        as: "phoneInfos",
                    },
                },

                {
                    $lookup: {
                        from: "userinfos",
                        foreignField: "_id",
                        localField: "userId",
                        as: "userInfo",
                    },
                },

                {
                    $unwind: "$userInfo",
                },

                {
                    $addFields: {
                        products: {
                            $map: {
                                input: "$products",
                                as: "product",
                                in: {
                                    $mergeObjects: [
                                        "$$product",
                                        {
                                            productInfo: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$phoneInfos",
                                                            as: "phoneInfo",
                                                            cond: {
                                                                $eq: [
                                                                    "$$phoneInfo._id",
                                                                    "$$product.phoneId",
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        phoneInfos: 0,
                    },
                },
            ]);
            return res.status(200).json(allOrders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new OrderController();
