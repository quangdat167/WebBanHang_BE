const siteRouter = require('./site');
const phonesRouter = require('./phones');
const apiRouter = require('./api');

function route(app) {
    app.use('/phones', phonesRouter);
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
}

module.exports = route;
