exports.errorHandler = async (err, req, res, _next) => {
	const statusCode = 500;

	res.json({
		statusCode,
		success: false,
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};
