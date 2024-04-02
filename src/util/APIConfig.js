class APIConfig {
    // Auth
    static SIGNUP = "/signup";
    static GET_USER_INFO = "/get-user-info";
    static SEARCH_USER_EMAIL = "/search-user-email";
    static UPDATE_USER_INFO = "/update-user-info";

    // Phones
    static GET_ALL_PHONES = "/phones";
    static GET_PHONE_BY_SLUG = "/get-phones-by-slug";
    static SEARCH_PHONE_BY_NAME = "/search-phone-by-name";
    static GET_RANDOM_PHONE = "/get-random-phone";
    static FILTER_PHONE = "/filter-phone";

    // Cart
    static ADD_TO_CART = "/add-to-cart";
    static GET_CART = "/get-cart";
    static DELETE_ITEM_FROM_CART = "/delete-item-from-cart";

    // Order
    static CREATE_ORDER = "/create-order";
    static GET_ALL_ORDERS = "/get-all-orders";
    static GET_ALL_ORDERS_APP = "/get-all-orders-app";

    // iTEMS
    static GET_BACKUP_CHARGE = "/get-backup-charge";
    static GET_ADAPTER = "/get-adapter";
    static GET_CAPBLE = "/get-cable";
    static GET_CASE = "/get-case";
    static GET_GLASS = "/get-glass";
}

module.exports = APIConfig;
