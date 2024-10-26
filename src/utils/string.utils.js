export const capitalizeFirstLetter = (str) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const generateAlphaNum = (longueur = 30, upper = false) => {
	const caracteres =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let cle = "";
	for (let i = 0; i < longueur; i++) {
		const indexAleatoire = Math.floor(Math.random() * caracteres.length);
		cle += caracteres[indexAleatoire];
	}
	return upper ? cle.toUpperCase() : cle;
};

export const sanatizeString = (str) => {
	let sanitized = str;
	// Enlève les balises HTML
	sanitized = str.replace(/<[^>]*>/g, "");
	// Enlève attribut et value href et src
	sanitized = sanitized.replace(/\s*(href|src)\s*=\s*["'][^"']*["']/gi, "");
	return sanitized;
};
