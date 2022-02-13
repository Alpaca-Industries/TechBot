'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const dbHelper_1 = require('../../helpers/dbHelper');
let BalanceCommand = class BalanceCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const balanceEmbed = new discord_js_1.MessageEmbed();
		const user = interaction.options.getUser('user', false) ?? interaction.user;
		const balance = await (0, dbHelper_1.fetchUser)(user);
		balanceEmbed
			.setTitle(`${user.username}, this is your balance!`)
			.addField('Wallet:', balance.wallet.toLocaleString())
			.addField('Bank:', balance.bank.toLocaleString())
			.addField('Total:', (balance.wallet + balance.bank).toLocaleString())
			.setColor('#4EAFF6');
		return interaction.reply({ embeds: [balanceEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((options) =>
					options.setName('user').setDescription('The user to check the balance of.')
				)
		);
	}
};
BalanceCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'balance',
			aliases: ['bal', 'money', 'balance', 'cash'],
			description: "Returns a user's current balance.",
			detailedDescription: 'balance [user]'
		})
	],
	BalanceCommand
);
exports.default = BalanceCommand;
//# sourceMappingURL=balance.js.map
