'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
const parseAmount_1 = require('../../helpers/parseAmount');
const isSafeInteger_1 = require('../../helpers/isSafeInteger');
let withdrawCommand = class withdrawCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const arg = interaction.options.getString('amount');
		const amountToWithdraw = (0, parseAmount_1.parseAmount)(arg, user, false);
		if (isNaN(amountToWithdraw))
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)('Please specify a valid amount of money to withdraw')
				],
				ephemeral: true
			});
		if (amountToWithdraw > user.bank)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						"You don't have enough money in your bank to withdraw that much"
					)
				],
				ephemeral: true
			});
		if (!(0, isSafeInteger_1.isSafeInteger)(amountToWithdraw))
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`$/${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				],
				ephemeral: true
			});
		user.wallet += amountToWithdraw;
		user.bank -= amountToWithdraw;
		await user.save();
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new discord_js_1.WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new discord_js_1.MessageEmbed()
			.setTitle('Withdraw')
			.setDescription(
				`${interaction.user.tag} (${
					interaction.user.id
				}) has withdrawn ${amountToWithdraw.toLocaleString()} coins from their bank account.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		await webhook.send({ embeds: [embed] });
		const response = new discord_js_1.MessageEmbed()
			.setDescription(`You withdrew **$${amountToWithdraw.toLocaleString()}** from your bank account.`)
			.setTitle('Withdraw')
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
						.setRequired(true)
						.setDescription('The amount of money to withdraw')
				)
		);
	}
};
withdrawCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'withdraw',
			description: 'Allows you withdraw coins into your bank account.',
			aliases: ['with', 'withdrow'],
			detailedDescription: 'with <amount>'
		})
	],
	withdrawCommand
);
exports.default = withdrawCommand;
//# sourceMappingURL=withdraw.js.map
