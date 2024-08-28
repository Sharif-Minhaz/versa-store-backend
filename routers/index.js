const productHandler = require("./product.routes");

const routes = [
	{
		path: "products",
		handler: productHandler,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use(`/api/v1/${route.path}`, route.handler);
	});
};
