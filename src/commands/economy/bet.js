'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const embeds_1 = require('../../helpers/embeds');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const parseAmount_1 = require('../../helpers/parseAmount');
let BetCommand = class BetCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const userDetails = await (0, dbHelper_1.fetchUser)(interaction.user);
		const betAmount = (0, parseAmount_1.parseAmount)(
			interaction.options.getString('amount'),
			userDetails
		);
		if (betAmount < 10 || isNaN(betAmount))
			return interaction.reply('Please bet a valid amount above 10!');
		if (userDetails.wallet < betAmount)
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);
		const chance = Math.random() < 0.5;
		if (chance) {
			userDetails.wallet += betAmount;
			await userDetails.save();
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateEmbed)(
						`Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`,
						'Bet Won',
						'DARK_GREEN'
					)
				]
			});
		} else {
			userDetails.wallet -= betAmount;
			await userDetails.save();
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateEmbed)(
						`${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`,
						'Bet Lost',
						'RED'
					)
				]
			});
		}
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('amount').setDescription('The amount of money to bet.').setRequired(true)
				)
		);
	}
};
BetCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'bet',
			description: 'Gives you a 50/50 chance to earn double what you bet.',
			detailedDescription: 'bet <bet amount>'
		})
	],
	BetCommand
);
exports.default = BetCommand;
//# sourceMappingURL=bet.js.map
