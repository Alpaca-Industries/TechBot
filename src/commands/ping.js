'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PingCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let PingCommand = class PingCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		await interaction.reply('Pinging...');
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			Date.now() - interaction.createdTimestamp
		}ms.`;
		return interaction.editReply(content);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
PingCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'ping',
			description: 'Pong!',
			detailedDescription: 'ping'
		})
	],
	PingCommand
);
exports.PingCommand = PingCommand;
//# sourceMappingURL=ping.js.map
