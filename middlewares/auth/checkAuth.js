const jwt = require("jsonwebtoken");
const { throwError } = require("../../utils/throwError");

const checkAuth = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		throwError("Token missing", 400);
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			throwError("Invalid Token", 403);
		}

		if (decoded.type !== "access") {
			throwError("Invalid Token Type", 403);
		}

		req.user = decoded; // Store decoded token payload in request object
		next();
	});
};

module.exports = checkAuth;
