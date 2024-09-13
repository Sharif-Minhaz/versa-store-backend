const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	filename: function (_req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	},
});

// file filter to allow only images
const fileFilter = (req, file, cb) => {
	// check the file extension
	const fileTypes = /jpeg|jpg|png|gif|webp|svg/;
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		// reject the file if not matches
		cb(new Error("Only images are allowed!"));
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
