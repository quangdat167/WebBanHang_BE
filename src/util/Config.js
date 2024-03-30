class Config {
    static USER_ROLE_ADMIN = 1;
    static USER_ROLE_MEMBER = 2;

    static ORDER_STATUS = {
        PENDING: "Chờ xác nhận",
        CONFIRM: "Đã xác nhận",
        SHIPING: "Đang vận chuyển",
        CANCLE: "Đã hủy",
        SUCCESS: "Hoàn thành",
    };
    static SORT_BY = {
        PRICE_DESC: "price_desc",
        PRICE_ASC: "price_asc",
        POPULAR: "popular",
    };
}

module.exports = Config;
