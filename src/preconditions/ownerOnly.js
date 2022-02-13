'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ownerOnlyPrecondition = void 0;
const framework_1 = require('@sapphire/framework');
const config_1 = require('../config');
class ownerOnlyPrecondition extends framework_1.Precondition {
	async chatInputRun(interation) {
		return config_1.config.OWNERS.includes(interation.user.id)
			? this.ok()
			: this.error({ message: 'This command can only be used by the owner.' });
	}
}
exports.ownerOnlyPrecondition = ownerOnlyPrecondition;
//# sourceMappingURL=ownerOnly.js.map
