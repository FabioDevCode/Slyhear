import i18n from "i18n";

export default {
	__: function () {
		// biome-ignore lint/style/noArguments: <explanation>
		return i18n.__.apply(this, arguments);
	},
	__n: function () {
		// biome-ignore lint/style/noArguments: <explanation>
		return i18n.__n.apply(this, arguments);
	},
	log: (context) => {
		console.log(context);
		return;
	},
};
