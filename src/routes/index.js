const siteRouter = require('./site');
const phonesRouter = require('./phones');

function route(app) {
    app.use('/phones', phonesRouter);
    app.use('/', siteRouter);
}

module.exports = route;
