const productHandler = require("./product.routes");
const authHandler = require("./auth.routes");
const categoryHandler = require("./category.routes");
const paymentHandler = require("./payment.routes");
const orderHandler = require("./order.routes");

const routes = [
	{
		path: "products",
		handler: productHandler,
	},
	{
		path: "auth",
		handler: authHandler,
	},
	{
		path: "categories",
		handler: categoryHandler,
	},
	{
		path: "payment",
		handler: paymentHandler,
	},
	{
		path: "order",
		handler: orderHandler,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use(`/api/v1/${route.path}`, route.handler);
	});
};
