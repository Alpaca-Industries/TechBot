'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
let giveItemCommand = class giveItemCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const userToGiveTo = interaction.options.getUser('user');
		const itemToGive = interaction.options.getString('item');
		const amount = Number(interaction.options.getString('amount'));
		if (userToGiveTo.id === interaction.user.id)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)('You cannot give money to yourself!')]
			});
		if (userToGiveTo.bot)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)('Invalid User Specified!')]
			});
		if (itemToGive === null)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)('Invalid Item Specified!')]
			});
		if (amount < 0)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)('Please specify a valid amount of money to withdraw')
				]
			}); // return message.reply('Please specify a valid amount of money to withdraw');
		// Senders Inventory
		(0, dbHelper_1.fetchInventory)(
			interaction.user,
			await (0, dbHelper_1.fetchItemByName)(itemToGive)
		).then((inventory) => {
			if (inventory === undefined) return interaction.reply('You do not have that item');
			if (inventory.amount < amount)
				return interaction.reply({
					embeds: [(0, embeds_1.generateErrorEmbed)('You do not have that much of that item!')]
				});
			inventory.amount -= amount;
			inventory.save();
			return null;
		});
		// Recievers Inventory
		(0, dbHelper_1.fetchInventory)(userToGiveTo, await (0, dbHelper_1.fetchItemByName)(itemToGive)).then(
			(inventory) => {
				inventory.amount += amount;
				inventory.save();
			}
		);
		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new discord_js_1.WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new discord_js_1.MessageEmbed()
			.setTitle('User gave item!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} ${itemToGive} to ${
					userToGiveTo.tag
				}.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		await webhook.send({ embeds: [embed] });
		return interaction.reply(`You gave ${amount} ${itemToGive} to ${userToGiveTo.username}`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to give the item to.').setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money to transfer.')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option.setName('item').setDescription('The item to transfer.').setRequired(true)
				)
		);
	}
};
giveItemCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'giveItem',
			aliases: ['give-item', 'shareItem', 'share-item'],
			description: 'Allows you to give items to another user.',
			detailedDescription: 'give-item <user> <item> <amount>'
		})
	],
	giveItemCommand
);
exports.default = giveItemCommand;
//# sourceMappingURL=giveItem.js.map
