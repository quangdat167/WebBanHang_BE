const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const port = 3000;

const route = require('./routes');

const db = require('./config/db');
// Connnect to database
db.connect();

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//HTTP logger
app.use(morgan('dev'));

// Template engine`
app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Static file path
app.use(express.static(path.join(__dirname, 'public')));

// Route init
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port localhost:${port}`);
});
