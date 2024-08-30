const bcrypt = require("bcryptjs");

exports.bcryptCompare = (password, hashedPassword) => {
	const isCorrect = bcrypt.compareSync(password, hashedPassword);
	return isCorrect;
};

exports.bcryptHashing = (password) => {
	const hashed = bcrypt.hashSync(password, 8);
	return hashed;
};
