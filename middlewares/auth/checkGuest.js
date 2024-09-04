const { throwError } = require("../../utils/throwError");
const jwt = require("jsonwebtoken");

const checkGuest = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return next();
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			return next();
		}

		if (decoded) {
			throwError("User is already logged in", 403);
		}
	});
};

module.exports = checkGuest;
