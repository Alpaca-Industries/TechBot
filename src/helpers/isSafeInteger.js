'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isSafeInteger = void 0;
const isSafeInteger = (number) => {
	number = Number(String(number).replace(/\+/g, ''));
	if (!Number.isSafeInteger(number)) {
		return false;
	}
	if (number < 0) {
		return false;
	}
	return number <= 1000000000000;
};
exports.isSafeInteger = isSafeInteger;
//# sourceMappingURL=isSafeInteger.js.map
