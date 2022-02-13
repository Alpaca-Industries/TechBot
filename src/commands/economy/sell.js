'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SellCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
let SellCommand = class SellCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const item = interaction.options.getString('item').replaceAll(' ', '_');
		const amount = Number(interaction.options.getString('amount'));
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		await (0, dbHelper_1.fetchInventory)(
			interaction.user,
			await (0, dbHelper_1.fetchItemByName)(item)
		).then(async (inventory) => {
			const userItem = await (0, dbHelper_1.fetchItemByName)(item);
			if (!userItem.sellable) return interaction.reply('Item is not sellable!');
			if (inventory === undefined) return interaction.reply('You do not have that item');
			if (inventory.amount < amount)
				return interaction.reply({
					embeds: [(0, embeds_1.generateErrorEmbed)('You do not have that much of that item!')]
				});
			inventory.amount -= amount;
			await inventory.save();
			user.wallet += Math.trunc(userItem.price / 2);
			await user.save();
			return interaction.reply(
				`Sold **${amount}** of **${item}** for **$${Math.trunc(
					userItem.price / 2
				).toLocaleString()}**.`
			);
		});
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('item').setRequired(true).setDescription('The item to sell.')
				)
				.addStringOption((option) =>
					option.setName('amount').setRequired(true).setDescription('The amount to sell.')
				)
		);
	}
};
SellCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'sell',
			description: 'Sell an item.',
			detailedDescription: 'sell <item> <amount>'
		})
	],
	SellCommand
);
exports.SellCommand = SellCommand;
//# sourceMappingURL=sell.js.map
