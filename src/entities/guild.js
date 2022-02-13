'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Guild = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
let Guild = class Guild extends typeorm_1.BaseEntity {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'prefix', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'slotsWinMultiplier', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'slotsMoneyPool', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryColumn)(), (0, tslib_1.__metadata)('design:type', String)],
	Guild.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Guild.prototype,
	'prefix',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	Guild.prototype,
	'slotsWinMultiplier',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	Guild.prototype,
	'slotsMoneyPool',
	void 0
);
Guild = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], Guild);
exports.Guild = Guild;
//# sourceMappingURL=guild.js.map
