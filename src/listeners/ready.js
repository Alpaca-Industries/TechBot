'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let ReadyListener = class ReadyListener extends framework_1.Listener {
	run(client) {
		const { username, id } = client.user;
		this.container.logger.info(`Successfully logged in as ${username} (${id})`);
		// Generate Invite for bot with interations slope
		this.container.logger.info(
			this.container.client.generateInvite({
				scopes: ['bot', 'applications.commands', 'applications.store.update'],
				permissions: 'ADMINISTRATOR'
			})
		);
	}
};
ReadyListener = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			once: true,
			event: 'ready'
		})
	],
	ReadyListener
);
exports.default = ReadyListener;
//# sourceMappingURL=ready.js.map
