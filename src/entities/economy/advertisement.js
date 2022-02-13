'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Advertisement = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
let Advertisement = class Advertisement extends typeorm_1.BaseEntity {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'userID', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'messageID', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'channelID', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'guildID', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'title', {
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
		Object.defineProperty(this, 'price', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'duration', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'type', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'image', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'thumbnail', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'color', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryGeneratedColumn)(), (0, tslib_1.__metadata)('design:type', Number)],
	Advertisement.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'userID',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'messageID',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'channelID',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'guildID',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'title',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'description',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'price',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'duration',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'type',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'image',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'thumbnail',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Object)],
	Advertisement.prototype,
	'color',
	void 0
);
Advertisement = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], Advertisement);
exports.Advertisement = Advertisement;
//# sourceMappingURL=advertisement.js.map
