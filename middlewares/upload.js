const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the upload directory
const uploadDir = path.join(__dirname, "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, uploadDir);
	},
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
