'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
const advertisement_1 = require('./advertisement');
const inventory_1 = require('./inventory');
let User = class User extends typeorm_1.BaseEntity {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'wallet', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'bank', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'inventory', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'premium', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'preferredEmojiColor', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'ads', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'currentJob', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'jobEXP', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'passiveMode', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryColumn)(), (0, tslib_1.__metadata)('design:type', String)],
	User.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	User.prototype,
	'wallet',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	User.prototype,
	'bank',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.OneToMany)(
			() => inventory_1.Inventory,
			(inventory) => inventory.userId
		),
		(0, tslib_1.__metadata)('design:type', Array)
	],
	User.prototype,
	'inventory',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: false
		}),
		(0, tslib_1.__metadata)('design:type', Boolean)
	],
	User.prototype,
	'premium',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 'default'
		}),
		(0, tslib_1.__metadata)('design:type', String)
	],
	User.prototype,
	'preferredEmojiColor',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.OneToMany)(
			() => advertisement_1.Advertisement,
			(ad) => ad.userID
		),
		(0, tslib_1.__metadata)('design:type', Array)
	],
	User.prototype,
	'ads',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 'jobless'
		}),
		(0, tslib_1.__metadata)('design:type', String)
	],
	User.prototype,
	'currentJob',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: 0
		}),
		(0, tslib_1.__metadata)('design:type', Number)
	],
	User.prototype,
	'jobEXP',
	void 0
);
(0, tslib_1.__decorate)(
	[
		(0, typeorm_1.Column)({
			default: false
		}),
		(0, tslib_1.__metadata)('design:type', Boolean)
	],
	User.prototype,
	'passiveMode',
	void 0
);
User = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], User);
exports.User = User;
//# sourceMappingURL=user.js.map
