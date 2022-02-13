'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pluralize = void 0;
const pluralize = (text, num, suffix = 's') => {
	return text + (num !== 1 ? suffix : '');
};
exports.pluralize = pluralize;
//# sourceMappingURL=pluralize.js.map
