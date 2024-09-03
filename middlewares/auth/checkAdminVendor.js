const { throwError } = require("../../utils/throwError");

const checkAdminVendor = (req, res, next) => {
	const user = req.user;

	if (!user) {
		throwError("Not an authenticated user", 403); // Unauthorized
	}

	if (user.user_type === "admin" || user.user_type === "vendor") {
		next();
	} else {
		throwError("User is not an admin nor a vendor", 403);
	}
};

module.exports = checkAdminVendor;
