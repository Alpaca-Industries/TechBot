'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const user_1 = require('../../entities/economy/user');
let InventoryCommand = class InventoryCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const userToCheck = interaction.options.getUser('user') || interaction.user;
		const items = await user_1.User.getRepository().manager.query(`
			SELECT item.*, inventory.amount FROM item
			JOIN inventory ON inventory.itemID = item.id
			WHERE inventory.userId = ${userToCheck.id}
			`);
		const inventoryEmbed = new discord_js_1.MessageEmbed();
		if (items.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}
		let itemNumber = 1;
		for (const item of items) {
			inventoryEmbed.addField(
				`${itemNumber}: ${item.name}`,
				`Price: ${item.price.toLocaleString()}\nRarity: ${
					item.rarity
				}\nAmount: ${item.amount.toLocaleString()}`
			);
			itemNumber++;
		}
		return interaction.reply({ embeds: [inventoryEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to check the inventory of.')
				)
		);
	}
};
InventoryCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'inventory',
			description: "Shows a user's item inventory.",
			aliases: ['inv', 'bag', 'stuff'],
			detailedDescription: 'inventory [user]'
		})
	],
	InventoryCommand
);
exports.default = InventoryCommand;
//# sourceMappingURL=inventory.js.map
