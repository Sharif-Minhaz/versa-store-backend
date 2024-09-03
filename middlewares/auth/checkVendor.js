const { throwError } = require("../../utils/throwError");

const checkVendor = (req, res, next) => {
	const user = req.user;

	if (!user) {
		throwError("Not an authenticated user", 403); // Unauthorized
	}

	if (user.user_type === "admin") {
		next();
	} else {
		throwError("User is not an admin", 403);
	}
};

module.exports = checkVendor;
