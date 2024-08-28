require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db");
const { errorHandler } = require("./middlewares/errorHandler.js");
const setMiddlewares = require("./middlewares");
const setRoutes = require("./routers");

// set middlewares and routes
setMiddlewares(app);
setRoutes(app);

// using custom global error handler
app.use((_, res) => {
	res.status(404).json({
		success: false,
		message: "404 Page not found",
	});
});
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.info(`Server running at port: http://localhost:${PORT}`);
		});
	})
	.catch((err) => console.error(err.message));
