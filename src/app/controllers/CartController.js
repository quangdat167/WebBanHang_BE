const { mongoose } = require("mongoose");
const { CartModel } = require("../models/cart");
const ObjectId = mongoose.Types.ObjectId;

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, color, quantity, type } = req.body;

            const existingCart = await CartModel.findOne({ userId });

            if (existingCart) {
                const existingProd = existingCart.products.find(product => {
                    return (
                        product.productId.toString() === productId &&
                        product.type === type &&
                        product.color === color
                    );
                });

                if (existingProd) {
                    existingProd.quantity += 1;
                } else {
                    existingCart.products.push({
                        productId,
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
                            productId,
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

            return res.status(200).json(allCartOfUser);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteItemFromCart(req, res) {
        try {
            const { userId, productId } = req.body;
            const cartInfo = await CartModel.findOne({ userId });
            if (cartInfo) {
                cartInfo.products = cartInfo.products.filter(product => {
                    return product.productId.toString() !== productId;
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
