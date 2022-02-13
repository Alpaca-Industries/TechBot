'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
const parseAmount_1 = require('../../helpers/parseAmount');
const pluralize_1 = require('../../helpers/pluralize');
let giveMoneyCommand = class giveMoneyCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const receiver = interaction.options.getUser('user');
		const author = await (0, dbHelper_1.fetchUser)(interaction.user);
		const amount = (0, parseAmount_1.parseAmount)(interaction.options.getString('amount'), author);
		if (receiver.bot || receiver.id === interaction.user.id)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)('Invalid User Specified!')]
			});
		if (isNaN(amount) || amount < 0)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)('Please specify a valid amount of money to withdraw')
				]
			});
		if (author.wallet < amount)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)('You do not have that much money!')]
			});
		author.wallet -= amount;
		await author.save();
		const user = await (0, dbHelper_1.fetchUser)(receiver);
		user.wallet += amount;
		await user.save();
		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new discord_js_1.WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new discord_js_1.MessageEmbed()
			.setTitle('User gave money!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} to ${receiver.tag}.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		await webhook.send({ embeds: [embed] });
		const response = new discord_js_1.MessageEmbed()
			.setTitle('Money Transferred')
			.setDescription(
				`You gave **$${amount.toLocaleString()}** ${(0, pluralize_1.pluralize)(
					'coin',
					amount
				)} to **${receiver.tag}**.`
			)
			.addField(
				'Your Balance',
				`\`\`\`diff\n+ Before: ${(
					author.wallet + amount
				).toLocaleString()}\n- After: ${author.wallet.toLocaleString()}\`\`\``,
				true
			)
			.addField(
				`${receiver.tag}'s Balance`,
				`\`\`\`diff\n- Before: ${(
					user.wallet - amount
				).toLocaleString()}\n+ After: ${user.wallet.toLocaleString()}\`\`\``,
				true
			)
			.setColor('BLUE');
		return interaction.reply({ embeds: [response] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to give money to.').setRequired(true)
				)
				.addStringOption((option) => option.setName('amount').setRequired(true))
		);
	}
};
giveMoneyCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'giveMoney',
			aliases: ['give', 'share'],
			description: 'Allows you give money to another user.',
			detailedDescription: 'share <user> <amount>'
		})
	],
	giveMoneyCommand
);
exports.default = giveMoneyCommand;
//# sourceMappingURL=giveMoney.js.map
