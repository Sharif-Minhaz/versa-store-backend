const cloudinary = require("../utils/cloudinaryInit");

const deleteImage = async (public_id) => {
	await cloudinary.uploader.destroy(public_id);
};

module.exports = { deleteImage };
