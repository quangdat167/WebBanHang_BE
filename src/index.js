const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const cors = require("cors");

// Dotenv
require("dotenv").config();

// Format Time
const moment = require("moment");

const app = express();

const route = require("./routes");

const db = require("./config/db");
// Connnect to database
db.connect();

// Method overrides để gửi request form với phương thức PUT, DELETE
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Body-parse
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//HTTP logger
app.use(morgan("dev"));

// Template engine`
app.engine(
    ".hbs",
    engine({
        extname: ".hbs",
        helpers: {
            sum: (a, b) => a + b,
            deleteFirstItem: array => {
                array.splice(0, 1);
                return array;
            },
            create10InputEditImage: array => {
                let result = "";
                let string = "";
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
                return moment(time).format("DD/MM/YYYY HH:mm:ss");
            },
        },
    }),
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Static file path
app.use(express.static(path.join(__dirname, "public")));

var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8081",
};

// app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "http://localhost:8081");
//     res.header("Access-Control-Allow-Headers", true);
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     next();
// });
// Cors
app.use(cors());

// Route init
route(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Example app listening on port localhost:${PORT}`);
});
