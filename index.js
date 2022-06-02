const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const account = require("./routes/account");
const product = require("./routes/product");
const order = require("./routes/order");
const sales = require("./routes/sales");
const env = require("dotenv");

env.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mongodb connection
const db_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_CON, db_options)
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch((e) => {
        console.log("Error on connecting to database: ", e);
    });

app.use("/account", account);
app.use("/product", product);
app.use("/order", order);
app.use("/sales", sales)

app.listen(port, () => {
    console.log("Server is running...");
});
