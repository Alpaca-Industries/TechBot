'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoinFlipCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let CoinFlipCommand = class CoinFlipCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		if (Math.random() > 0.5) return interaction.reply('Heads');
		else return interaction.reply('Tails');
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
CoinFlipCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'coinflip',
			aliases: ['flip', 'coin-flip'],
			description: 'Flip a coin!',
			detailedDescription: 'coinflip'
		})
	],
	CoinFlipCommand
);
exports.CoinFlipCommand = CoinFlipCommand;
//# sourceMappingURL=coinflip.js.map
