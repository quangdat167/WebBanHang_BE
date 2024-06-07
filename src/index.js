const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Dotenv
require("dotenv").config();

// Format Time

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

var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8081",
};

// let transactions = [
//     [1, 3, 4],
//     [2, 3, 5],
//     [1, 2, 3, 5],
//     [2, 5],
//     [1, 2, 3, 5],
// ];

// // Execute FPGrowth with a minimum support of 40%. Algorithm is generic.
// let fpgrowth = new FPGrowth(0.6);

// // Returns itemsets 'as soon as possible' through events.
// fpgrowth.on("data", itemset => {
//     // Do something with the frequent itemset.
//     let support = itemset.support;
//     let items = itemset.items;
//     console.log("support: ", support);
//     console.log("items: ", items);
// });

// // Execute FPGrowth on a given set of transactions.
// fpgrowth.exec(transactions).then(itemsets => {
//     // Returns an array representing the frequent itemsets.
//     console.log("itemsets: ", itemsets);
// });

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
