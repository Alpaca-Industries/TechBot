'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.clean = void 0;
const config_1 = require('../config');
const clean = (text) => {
	return text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
		.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>')
		.replaceAll(config_1.config.token, '');
};
exports.clean = clean;
//# sourceMappingURL=clean.js.map
