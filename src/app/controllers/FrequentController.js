const Constants = require("../../util/Constant");
const { FrequentModel } = require("../models/frequent");
const { OrderModel } = require("../models/order");
const { ProductModel } = require("../models/product");
const { FPGrowth } = require("node-fpgrowth");
const { Apriori } = require("node-apriori");

function filterAndSortItemsetsFPGrowth(itemsets, targetId) {
    const filtered = itemsets
        .filter(itemset => itemset.items.length === 2 && itemset.items.includes(targetId))
        .map(itemset => {
            const filteredItems = itemset.items.filter(item => item !== targetId);
            return {
                itemId: filteredItems[0],
                support: itemset.support,
            };
        });
    filtered.sort((a, b) => {
        if (b.support === a.support) {
            return a.itemId.localeCompare(b.itemId);
        }
        return b.support - a.support;
    });

    return filtered;
}

function filterAndSortItemsetsApriori(itemsets, targetId) {
    const filtered = itemsets
        .map(itemset => {
            const item = itemset.items[0];
            if (item !== targetId) {
                return {
                    itemId: item,
                    support: itemset.support,
                };
            } else return;
        })
        .filter(item => item !== undefined);
    filtered.sort((a, b) => {
        if (b.support === a.support) {
            return a.itemId.localeCompare(b.itemId);
        }
        return b.support - a.support;
    });
    return filtered;
}

class FrequentController {
    constructor() {
        this.getAllFrequent = this.getAllFrequent.bind(this);
        this.calculateFrequentFPGrowth = this.calculateFrequentFPGrowth.bind(this);
        this.calculateFrequentApriori = this.calculateFrequentApriori.bind(this);
        this.applyFPGrowth = this.applyFPGrowth.bind(this);
        this.applyApriori = this.applyApriori.bind(this);
    }

    async calculateFrequentFPGrowth(req, res) {
        try {
            const phones = await ProductModel.find({ type: "phone" });
            await FrequentModel.updateMany({ algorithm: "Apriori" }, { apply: false });

            console.time("FPGrowth");
            const initialMemoryUsage = process.memoryUsage().heapUsed;

            for (const phone of phones) {
                const ordersContainingPhone = await OrderModel.find({
                    "products.productId": phone._id,
                });
                if (ordersContainingPhone.length > Constants.MIN_ORDER_PER_PHONE_FREQUENT) {
                    const allOrders = ordersContainingPhone.map(order =>
                        order.products.map(product => product.productId),
                    );

                    const fpgrowth = new FPGrowth(Constants.SUPPORT_FREQUENT);
                    const itemsets = await fpgrowth.exec(allOrders);

                    await FrequentModel.deleteMany({ productId: phone._id, algorithm: "FPGrowth" });

                    const frequentItems = filterAndSortItemsetsFPGrowth(
                        itemsets,
                        phone._id.toString(),
                    );

                    await FrequentModel.create({
                        productId: phone._id,
                        frequentItems: frequentItems,
                        algorithm: "FPGrowth",
                        apply: true,
                    });
                }
            }

            console.timeEnd("FPGrowth");
            const finalMemoryUsage = process.memoryUsage().heapUsed;
            console.log(`Memory used: ${(finalMemoryUsage - initialMemoryUsage) / 1024 / 1024} MB`);
        } catch (err) {
            console.log("FPGrowth error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async calculateFrequentApriori(req, res) {
        try {
            const phones = await ProductModel.find({ type: "phone" });
            await FrequentModel.updateMany({ algorithm: "FPGrowth" }, { apply: false });

            console.time("Apriori");
            const initialMemoryUsage = process.memoryUsage().heapUsed;

            for (const phone of phones) {
                const ordersContainingPhone = await OrderModel.find({
                    "products.productId": phone._id,
                });
                if (ordersContainingPhone.length > Constants.MIN_ORDER_PER_PHONE_FREQUENT) {
                    const allOrders = ordersContainingPhone.map(order =>
                        order.products.map(product => product.productId),
                    );

                    const apriori = new Apriori(Constants.SUPPORT_FREQUENT);
                    const itemsets = await apriori.exec(allOrders);

                    await FrequentModel.deleteMany({ productId: phone._id, algorithm: "Apriori" });

                    const frequentItems = filterAndSortItemsetsApriori(
                        itemsets.itemsets,
                        phone._id.toString(),
                    );

                    await FrequentModel.create({
                        productId: phone._id,
                        frequentItems: frequentItems,
                        algorithm: "Apriori",
                        apply: true,
                    });
                }
            }

            console.timeEnd("Apriori");
            const finalMemoryUsage = process.memoryUsage().heapUsed;
            console.log(`Memory used: ${(finalMemoryUsage - initialMemoryUsage) / 1024 / 1024} MB`);
        } catch (err) {
            console.log("Apriori error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllFrequent(req, res) {
        try {
            const allFrequent = await FrequentModel.aggregate([
                {
                    $match: { apply: true },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productInfo",
                    },
                },
                {
                    $unwind: "$productInfo",
                },
                {
                    $unwind: "$frequentItems",
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "frequentItems.itemId",
                        foreignField: "_id",
                        as: "frequentItemsDetails",
                    },
                },
                {
                    $unwind: "$frequentItemsDetails",
                },
                {
                    $group: {
                        _id: "$_id",
                        productId: { $first: "$productId" },
                        productInfo: { $first: "$productInfo" },
                        algorithm: { $first: "$algorithm" },
                        frequentItems: {
                            $push: {
                                itemId: "$frequentItems.itemId",
                                support: "$frequentItems.support",
                                itemDetails: "$frequentItemsDetails",
                            },
                        },
                    },
                },
                {
                    $sort: { "productInfo.brand": 1 },
                },
            ]);

            res.status(200).json(allFrequent);
        } catch (err) {
            console.log("Get all frequent error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async applyFPGrowth(req, res) {
        try {
            await this.calculateFrequentFPGrowth(req, res);
            await this.getAllFrequent(req, res);
        } catch (err) {
            console.log("Apply FPGrowth error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async applyApriori(req, res) {
        try {
            await this.calculateFrequentApriori(req, res);
            await this.getAllFrequent(req, res);
        } catch (err) {
            console.log("Apply Apriori error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new FrequentController();
