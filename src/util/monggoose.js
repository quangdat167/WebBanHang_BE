module.exports = {
    multipleMongooseToObject: function (monggoses) {
        return monggoses.map((mongoose) => mongoose.toObject());
    },

    monggoseToObject: function (monggose) {
        return monggose ? monggose.toObject() : monggose;
    },
};
