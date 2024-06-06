const Constants = require("../../util/Constant");
const { FrequentModel } = require("../models/frequent");
const { OrderModel } = require("../models/order");
const { ProductModel } = require("../models/product");
const { UserInfoModel } = require("../models/user");
const { FPGrowth } = require("node-fpgrowth");
const { Apriori } = require("node-apriori");
function filterAndSortItemsetsFPGrowth(itemsets, targetId) {
    // Lọc các phần tử thỏa mãn điều kiện
    const filtered = itemsets
        .filter(itemset => itemset.items.length === 2 && itemset.items.includes(targetId))
        .map(itemset => {
            const filteredItems = itemset.items.filter(item => item !== targetId);
            return {
                itemId: filteredItems[0],
                support: itemset.support,
            };
        });

    // Sắp xếp các phần tử theo support giảm dần
    filtered.sort((a, b) => b.support - a.support);

    return filtered;
}

function filterAndSortItemsetsApriori(itemsets, targetId) {
    // Lọc các phần tử thỏa mãn điều kiện
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

    // Sắp xếp các phần tử theo support giảm dần
    filtered.sort((a, b) => b.support - a.support);
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
            // Step 1: Lấy tất cả các sản phẩm có type là "phone" từ PhoneModel
            const phones = await ProductModel.find({ type: "phone" });

            await FrequentModel.updateMany({ algorithm: "Apriori" }, { apply: false });

            for (const phone of phones) {
                // Step 2: Lọc tất cả các đơn hàng mà chứa sản phẩm phone đang xét
                const ordersContainingPhone = await OrderModel.find({
                    "products.productId": phone._id,
                });
                if (ordersContainingPhone.length > Constants.MIN_ORDER_PER_PHONE_FREQUENT) {
                    const allOrders = ordersContainingPhone.map(order =>
                        order.products.map(product => product.productId),
                    );

                    // Step 3: Thực hiện tính toán frequent với các đơn hàng thu được từ bước trước, sử dụng thuật toán FPGrowth
                    const fpgrowth = new FPGrowth(Constants.SUPPORT_FREQUENT);
                    const itemsets = await fpgrowth.exec(allOrders);

                    // Step 4: Xóa tất cả các mục hiện có trong FrequentModel liên quan đến sản phẩm phone đang xét
                    await FrequentModel.deleteMany({ productId: phone._id, algorithm: "FPGrowth" });

                    // Step 5: Lưu kết quả tính toán frequent vào bảng FrequentModel

                    const frequentItems = filterAndSortItemsetsFPGrowth(
                        itemsets,
                        phone._id.toString(),
                    );

                    // Lưu kết quả vào FrequentModel
                    await FrequentModel.create({
                        productId: phone._id,
                        frequentItems: frequentItems,
                        algorithm: "FPGrowth",
                        apply: true,
                    });
                }
            }
            // res.status(200).json({ message: "calculate success" });
        } catch (err) {
            console.log("FPGrowth error: ", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async calculateFrequentApriori(req, res) {
        try {
            // Step 1: Lấy tất cả các sản phẩm có type là "phone" từ PhoneModel
            const phones = await ProductModel.find({ type: "phone" });
            await FrequentModel.updateMany({ algorithm: "FPGrowth" }, { apply: false });

            for (const phone of phones) {
                // Step 2: Lọc tất cả các đơn hàng mà chứa sản phẩm phone đang xét
                const ordersContainingPhone = await OrderModel.find({
                    "products.productId": phone._id,
                });
                if (ordersContainingPhone.length > Constants.MIN_ORDER_PER_PHONE_FREQUENT) {
                    const allOrders = ordersContainingPhone.map(order =>
                        order.products.map(product => product.productId),
                    );

                    // Step 3: Thực hiện tính toán frequent với các đơn hàng thu được từ bước trước, sử dụng thuật toán FPGrowth
                    const apriori = new Apriori(Constants.SUPPORT_FREQUENT);
                    const itemsets = await apriori.exec(allOrders);

                    // Step 4: Xóa tất cả các mục hiện có trong FrequentModel liên quan đến sản phẩm phone đang xét

                    await FrequentModel.deleteMany({ productId: phone._id, algorithm: "Apriori" });

                    // Step 5: Lưu kết quả tính toán frequent vào bảng FrequentModel

                    const frequentItems = filterAndSortItemsetsApriori(
                        itemsets.itemsets,
                        phone._id.toString(),
                    );

                    // Lưu kết quả vào FrequentModel
                    await FrequentModel.create({
                        productId: phone._id,
                        frequentItems: frequentItems,
                        algorithm: "Apriori",
                        apply: true,
                    });
                }
            }
            // res.status(200).json({ message: "calculate success" });
        } catch (err) {
            console.log("FPGrowth error: ", err);
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
                        from: "products", // Tên collection ProductModel
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
