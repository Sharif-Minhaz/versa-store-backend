const capitalize = (str) => {
	const words = str.toLowerCase();
	const capitalizedWords = words.replace(words.charAt(0), words.charAt(0).toUpperCase());
	return capitalizedWords;
};

module.exports = { capitalize };
