const siteRouter = require('./site');
const phonesRouter = require('./phones');
const apiRouter = require('./api');
const authRouter = require('./auth.route');

function route(app) {
    app.use('/phones', phonesRouter);
    app.use('/api', apiRouter);
    app.use('/api', authRouter);
    app.use('/', siteRouter);
}

module.exports = route;
