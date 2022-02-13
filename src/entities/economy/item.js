'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Item = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
let Item = class Item extends typeorm_1.BaseEntity {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'price', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'rarity', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'emoji', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'description', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'sellable', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'tradeable', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'collectable', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryGeneratedColumn)(), (0, tslib_1.__metadata)('design:type', Number)],
	Item.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', String)],
	Item.prototype,
	'name',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Number)],
	Item.prototype,
	'price',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', String)],
	Item.prototype,
	'rarity',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', String)],
	Item.prototype,
	'emoji',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 'I was forgotten about by the devs ;('
		}),
		(0, tslib_1.__metadata)('design:type', String)
	],
	Item.prototype,
	'description',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: false
		}),
		(0, tslib_1.__metadata)('design:type', Boolean)
	],
	Item.prototype,
	'sellable',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: false
		}),
		(0, tslib_1.__metadata)('design:type', Boolean)
	],
	Item.prototype,
	'tradeable',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: false
		}),
		(0, tslib_1.__metadata)('design:type', Boolean)
	],
	Item.prototype,
	'collectable',
	void 0
);
Item = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], Item);
exports.Item = Item;
//# sourceMappingURL=item.js.map
