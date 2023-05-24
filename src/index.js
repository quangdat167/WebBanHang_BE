const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');

// Format Time
const moment = require('moment');

const app = express();
const port = 3010;

const route = require('./routes');

const db = require('./config/db');
// Connnect to database
db.connect();

// Method overrides để gửi request form với phương thức PUT, DELETE
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Body-parse
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
            deleteFirstItem: array => {
                array.splice(0, 1);
                return array;
            },
            create10InputEditImage: array => {
                let result = '';
                let string = '';
                for (let i = 0; i < 10; i++) {
                    let item = array[i];
                    if (item) {
                        string = `<div class="row mb-2 align-items-center">
                        <div class="col-1">
                        <img
                                    src='${item}'
                                    alt='Ảnh mẫu'
                                    class='image-swipe border rounded-3'
                            />
                        </div>
                        <div class="col-11 ">
                                   <input type='text' class='form-control ' placeholder="Images ${
                                       i + 1
                                   }"
                                    name='images' value="${item}"/>
                        </div>
                        </div>`;
                    } else {
                        string = `
                        <input type='text' class='form-control mb-2' placeholder="Images ${
                            i + 1
                        }" name='images' />
                        `;
                    }
                    result += string;
                }
                return result;
            },
            formatTime: function (time) {
                return moment(time).format('DD/MM/YYYY HH:mm:ss');
            },
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
