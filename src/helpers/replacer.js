'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.replacer = void 0;
const replacer = (string, object, regexFlag = '') => {
	for (const [key, value] of Object.entries(object)) {
		let reg = new RegExp(key, regexFlag);
		string = string.replace(reg, value);
	}
	return string;
};
exports.replacer = replacer;
//# sourceMappingURL=replacer.js.map
