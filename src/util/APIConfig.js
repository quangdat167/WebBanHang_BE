class APIConfig {
    // Auth
    static SIGNUP = "/signup";
    static GET_USER_INFO = "/get-user-info";
    static SEARCH_USER_EMAIL = "/search-user-email";
    static UPDATE_USER_INFO = "/update-user-info";

    // products
    static GET_PRODUCT_BY_SLUG = "/get-product-by-slug";
    static GET_PRODUCT_BY_TYPE = "/get-product-by-type";
    static SEARCH_PHONE_BY_NAME = "/search-phone-by-name";
    static GET_RANDOM_PRODUCT = "/get-random-product";
    static FILTER_PHONE = "/filter-phone";

    // Cart
    static ADD_TO_CART = "/add-to-cart";
    static GET_CART = "/get-cart";
    static DELETE_ITEM_FROM_CART = "/delete-item-from-cart";

    // Order
    static CREATE_ORDER = "/create-order";
    static GET_ALL_ORDERS = "/get-all-orders";
    static GET_ALL_ORDERS_APP = "/get-all-orders-app";
}

module.exports = APIConfig;
