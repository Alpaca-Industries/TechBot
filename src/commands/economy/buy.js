'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
let BuyCommand = class BuyCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const itemToBuy = interaction.options.getString('item');
		const item = await (0, dbHelper_1.fetchItemByName)(itemToBuy.replaceAll(' ', '_'));
		if (item === undefined)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`Invalid item \'${itemToBuy}\' specified!`,
						'Invalid Item Name'
					)
				]
			});
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		if (user.wallet < item.price) {
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${user.wallet.toLocaleString()}\`.\nUsage: \`/${
							this.detailedDescription
						}\``
					)
				],
				ephemeral: true
			});
		}
		user.wallet -= item.price;
		await user.save();
		(0, dbHelper_1.fetchInventory)(interaction.user, item).then((inventory) => {
			inventory.amount++;
			inventory.save();
		});
		return interaction.reply(`You bought **${item.name}** for **$${item.price.toLocaleString()}**`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('item').setDescription('The item you want to buy.').setRequired(true)
				)
		);
	}
};
BuyCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'buy',
			description: 'Gives you the ability to buy items from the store.',
			detailedDescription: 'buy <item>'
		})
	],
	BuyCommand
);
exports.default = BuyCommand;
//# sourceMappingURL=buy.js.map
