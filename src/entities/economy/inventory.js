'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Inventory = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
let Inventory = class Inventory extends typeorm_1.BaseEntity {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'userId', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'itemID', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'amount', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryGeneratedColumn)(), (0, tslib_1.__metadata)('design:type', Number)],
	Inventory.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Inventory.prototype,
	'userId',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Inventory.prototype,
	'itemID',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	Inventory.prototype,
	'amount',
	void 0
);
Inventory = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], Inventory);
exports.Inventory = Inventory;
//# sourceMappingURL=inventory.js.map
