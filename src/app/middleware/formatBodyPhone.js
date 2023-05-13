module.exports = function formatBodyPhone(req, res, next) {
    const phone = {};
    phone.name = req.body.name;
    phone.brand = req.body.brand;
    phone.specifications = req.body.specifications.filter(item => item !== '');
    phone.description = req.body.description.filter(item => item !== '');
    const arrayTypes = req.body.types.filter(item => item !== '');
    const arrayPrices = req.body.prices.filter(item => item !== '');
    const arrayColors = req.body.colors.filter(item => item !== '');
    const arrayImg = req.body.img.filter(item => item !== '');
    phone.images = req.body.images.filter(item => item !== '');
    phone.prices = [];
    arrayPrices.map((price, index) =>
        phone.prices.push({
            type: arrayTypes[index],
            price,
        }),
    );
    phone.colors = [];
    arrayColors.map((color, index) =>
        phone.colors.push({
            img: arrayImg[index],
            color,
        }),
    );

    req.body = phone;
    next();
};
