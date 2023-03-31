import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import path from "path";
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import  bodyparser from "body-parser";
import stripe  from "stripe";(Secret_Key)

import User from './models/userModel.js'

// const path = require("path");

dotenv.config();
connectDB();
const app = express();

if (process.env.NODE_ENV === "developement") {
    app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

app.get('/getusers123',(req,res)=>{
  User.find().then((data)=>{
    res.send(data);
  })
})
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is Runn....");
    });
}

app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome'
    })
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`.bgCyan.white);
})


// var Publishable_Key =
//   "pk_test_51MqW2qA47W9khQlSun7aQ9slCZBjmQQHnPkpOxNBZqWJyXcxf5nRcChJRFnQFEfiDQYqT9tdp6CuaLTCnqDJoAnV002LZYJa9M";
// var Secret_Key =
//   "sk_test_51MqW2qA47W9khQlSsbI0rJ9SwQJVMQkrzNw50q4qjArZW7a74Dv8TiVtIQSmuI1C3Q2j5Md4jnC1oAymC23HUka300QPvyoyEz";
var Secret_Key = "sk_test_51MneGzSFJ3x4MWy5VwXm9ug2MuS7P4yumgZ6V0mZYPKOqtecuebzEpdxtZprF1gDYSXzQhi8kOCRdrzJyAQBEjVT00bnNIqDhA "

var Publishable_Key = " pk_test_51MneGzSFJ3x4MWy5Fewwpx7igarcGpDlCNRmsPxdAfAQE7eFzcaA5Rl3mRf5FFxq1bgP7yv2QWpv7bc9NO0ozAup00iBq5CZjb"
// const stripe = require("stripe")(Secret_Key);

// const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("Home", {
    key: Publishable_Key,
  });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form            
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Gourav Hammad",
      address: {
        line1: "TC 9/4 Old MES colony",
        postal_code: "452331",
        city: "Indore",
        state: "Madhya Pradesh",
        country: "India",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 2500, // Charging Rs 25
        description: "Web Development Product",
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      console.log(charge);
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

// app.listen(port, function (error) {
//   if (error) throw error;
//   console.log("Server created Successfully");
// });