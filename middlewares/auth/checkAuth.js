const jwt = require("jsonwebtoken");
const { throwError } = require("../../utils/throwError");

const checkAuth = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		throwError("Token is missing", 400);
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			throwError("Invalid token, verification failed", 403);
		}

		if (decoded.type !== "access") {
			throwError("Invalid token type, required an access token", 403);
		}

		req.user = decoded; // Store decoded token payload in request object
		next();
	});
};

module.exports = checkAuth;
