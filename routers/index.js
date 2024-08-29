const productHandler = require("./product.routes");
const authHandler = require("./auth.routes");

const routes = [
	{
		path: "products",
		handler: productHandler,
	},
	{
		path: "auth",
		handler: authHandler,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use(`/api/v1/${route.path}`, route.handler);
	});
};
