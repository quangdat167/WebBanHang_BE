const { CartModel } = require("../models/cart.model");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, phoneId, color, quantity, type } = req.body;

            const existingCart = await CartModel.findOne({ userId });

            if (existingCart) {
                const existingProd = existingCart.products.find(product => {
                    return (
                        product.phoneId.toString() === phoneId &&
                        product.type === type &&
                        product.color === color
                    );
                });

                if (existingProd) {
                    existingProd.quantity += 1;
                } else {
                    existingCart.products.push({
                        phoneId,
                        color,
                        quantity,
                        type,
                    });
                }
                existingCart.save();

                return res.status(200).json(existingCart);
            } else {
                const newCart = await CartModel.create({
                    userId,
                    products: [
                        {
                            phoneId,
                            color,
                            quantity,
                            type,
                        },
                    ],
                });
                newCart.save();
                return res.status(200).json(newCart);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllFromCart(req, res) {
        try {
            const { userId } = req.body;

            const allCartOfUser = await CartModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId),
                    },
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

            return res.status(200).json(allCartOfUser);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteItemFromCart(req, res) {
        try {
            const { userId, phoneId } = req.body;
            const cartInfo = await CartModel.findOne({ userId });
            if (cartInfo) {
                cartInfo.products = cartInfo.products.filter(product => {
                    return product.phoneId.toString() !== phoneId;
                });

                cartInfo.save();
            }
            return res.status(200).json(cartInfo);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new CartController();
