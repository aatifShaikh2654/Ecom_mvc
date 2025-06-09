const express = require('express');
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config({ path: './.env' });
// initiate express 
const app = express();
// for req.cookie to get token while autentication
app.use(cookieParser());
// common middlware 
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json({ limit: "50mb" }));
// security middlewares 
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
    })
);

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 500, // max requests per IP
});

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"];

app.use('/public', express.static('./public', {
    setHeaders: (res) => {
        res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || "http://localhost:3000");
    },
}));
// for cors allowing host 

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

const auth = require("./routes/auth.route")
const cart = require("./routes/cart.route")
const orders = require("./routes/orders.route")
const products = require("./routes/products.route")
const report = require("./routes/report.route")

app.use('/api/v1', limiter);
app.use('/api/v1', auth);
app.use('/api/v1', cart);
app.use('/api/v1', orders);
app.use('/api/v1', products);
app.use('/api/v1', report);

app.use(errorMiddleware);


module.exports = { app }