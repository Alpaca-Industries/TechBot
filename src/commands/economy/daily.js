'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const framework_1 = require('@sapphire/framework');
let DailyCommand = class DailyCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const embed = new discord_js_1.MessageEmbed();
		const moneyEarned = Math.round(Math.random() * (3000 - 750) + 750);
		(0, dbHelper_1.fetchUser)(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});
		embed
			.setTitle('Daily Coins :D')
			.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tommorow.`)
			.setColor('BLUE');
		return interaction.reply({ embeds: [embed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
DailyCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'daily',
			description: 'Get those yummy pepe coins, I know you want them.',
			cooldownDelay: 86400000,
			detailedDescription: 'daily'
		})
	],
	DailyCommand
);
exports.default = DailyCommand;
//# sourceMappingURL=daily.js.map
