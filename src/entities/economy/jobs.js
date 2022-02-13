'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Jobs = void 0;
const tslib_1 = require('tslib');
const typeorm_1 = require('typeorm');
let Jobs = class Jobs extends typeorm_1.BaseEntity {
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
		Object.defineProperty(this, 'description', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'minimumXP', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
};
(0, tslib_1.__decorate)(
	[(0, typeorm_1.PrimaryGeneratedColumn)(), (0, tslib_1.__metadata)('design:type', Number)],
	Jobs.prototype,
	'id',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', String)],
	Jobs.prototype,
	'name',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', String)],
	Jobs.prototype,
	'description',
	void 0
);
(0, tslib_1.__decorate)(
	[(0, typeorm_1.Column)(), (0, tslib_1.__metadata)('design:type', Number)],
	Jobs.prototype,
	'minimumXP',
	void 0
);
Jobs = (0, tslib_1.__decorate)([(0, typeorm_1.Entity)()], Jobs);
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.js.map
