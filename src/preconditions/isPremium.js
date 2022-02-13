'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isPremiumPrecondition = void 0;
const framework_1 = require('@sapphire/framework');
const dbHelper_1 = require('../helpers/dbHelper');
class isPremiumPrecondition extends framework_1.Precondition {
	async chatInputRun(interaction) {
		return (await (0, dbHelper_1.fetchUser)(interaction.user)).premium
			? this.ok()
			: this.error({ message: 'You need to be a premium user to use this command.' });
	}
}
exports.isPremiumPrecondition = isPremiumPrecondition;
//# sourceMappingURL=isPremium.js.map
