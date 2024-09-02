const cloudinary = require("../utils/cloudinaryInit");
const { throwError } = require("./throwError");

const deleteImage = async (public_id) => {
	if (!public_id) throwError("Public id required", 400);

	await cloudinary.uploader.destroy(public_id);
};

module.exports = { deleteImage };
