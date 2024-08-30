const cloudinary = require("./cloudinaryInit");

async function uploadImageHandler(file, destination = "versaShop") {
	let uploadImage = {};

	if (file) {
		uploadImage = await cloudinary.uploader.upload(file.path, {
			folder: destination,
		});
	}

	return uploadImage;
}

module.exports = { uploadImageHandler };
