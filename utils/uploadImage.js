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

const uploadImages = async (files) => {
	return await Promise.all(
		files.map((file) => {
			const uploadResult = uploadImageHandler(file);
			return uploadResult;
		})
	);
};

module.exports = { uploadImageHandler, uploadImages };
