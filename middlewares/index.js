const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: "Too many request, Try again after sometimes.",
});

const middlewares = [
	express.static("public"),
	express.json(),
	express.urlencoded({ extended: true }),
	morgan("dev"),
	limiter,
	xssClean(),
	cors({
		credentials: true,
		origin: ["http://localhost:5173", "https://versa-store.netlify.app"],
	}),
	cookieParser(),
];

module.exports = (app) => {
	app.use(middlewares);
};
