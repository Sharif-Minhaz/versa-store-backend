const { throwError } = require("../../utils/throwError");

const checkGuest = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		next();
	} else {
		throwError("User is already logged in", 403);
	}
};

module.exports = checkGuest;
