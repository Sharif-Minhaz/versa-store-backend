const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({
	filename: function (_req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
	},
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
	const fileTypes = /jpeg|jpg|png|gif|webp|svg/;
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new Error("Only images are allowed!"));
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
