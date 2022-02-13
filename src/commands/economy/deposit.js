'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const parseAmount_1 = require('../../helpers/parseAmount');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
const isSafeInteger_1 = require('../../helpers/isSafeInteger');
let depositCommand = class depositCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const arg = interaction.options.getString('amount');
		const amountToDeposit = (0, parseAmount_1.parseAmount)(arg, user, true);
		if (isNaN(amountToDeposit))
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`'${arg}' is not a parsable integer.\nUsage: \`/${this.detailedDescription}\``,
						'Invalid Number'
					)
				],
				ephemeral: true
			});
		if (amountToDeposit > user.wallet)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`You don't have enough money to deposit '${arg}'.\nUsage: \`/${this.detailedDescription}\``,
						'Invalid Amount'
					)
				],
				ephemeral: true
			});
		if (!(0, isSafeInteger_1.isSafeInteger)(amountToDeposit))
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`/${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				],
				ephemeral: true
			});
		user.wallet -= amountToDeposit;
		user.bank += amountToDeposit;
		await user.save();
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new discord_js_1.WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		await webhook.send({
			embeds: [
				{
					title: 'User Deposit',
					description: `${interaction.user.tag} (${
						interaction.user.id
					}) has deposited ${amountToDeposit.toLocaleString()} coins into their account.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});
		const response = new discord_js_1.MessageEmbed()
			.setDescription(`You deposited **$${amountToDeposit.toLocaleString()}** into your bank account.`)
			.setTitle('Deposit')
			.setColor('BLUE');
		return interaction.reply({ embeds: [response] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money to deposit')
						.setRequired(true)
				)
		);
	}
};
depositCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'deposit',
			description: 'Lets your deposit coins into your bank account',
			aliases: ['dep', 'depos'],
			detailedDescription: 'deposit <amount>'
		})
	],
	depositCommand
);
exports.default = depositCommand;
//# sourceMappingURL=deposit.js.map
