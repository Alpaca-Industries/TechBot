'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const item_1 = require('../../entities/economy/item');
const embeds_1 = require('../../helpers/embeds');
let ShopCommand = class ShopCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const specificItem = interaction.options.getString('item') || '';
		if (specificItem.length > 0) {
			const item = await item_1.Item.findOne({ where: { name: specificItem.toProperCase() } });
			if (item !== undefined) {
				const embed = new discord_js_1.MessageEmbed()
					.setTitle(item.name.toProperCase())
					.setDescription(`> ${item.description}\nPrice: $${item.price.toLocaleString()}`)
					.setColor('BLUE');
				return interaction.reply({ embeds: [embed] });
			} else {
				return interaction.reply({
					embeds: [
						(0, embeds_1.generateErrorEmbed)(
							`Could not find item with name '${specificItem}'.`,
							'Invalid Item Name'
						)
					],
					ephemeral: true
				});
			}
		}
		const items = await item_1.Item.createQueryBuilder('item').orderBy('item.price', 'ASC').getMany();
		const embed = new discord_js_1.MessageEmbed()
			.setTitle('Items For Sale')
			.setDescription(
				items
					.map(
						(item) =>
							`${item.emoji} **${item.name.toProperCase()}** - $${item.price.toLocaleString()}`
					)
					.join('\n')
			)
			.setColor(0x00ff00);
		return interaction.reply({ embeds: [embed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('item').setDescription('The item to get information on.')
				)
		);
	}
};
ShopCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'shop',
			description: 'Gives you a list of the buyable items and their prices.',
			detailedDescription: 'shop'
		})
	],
	ShopCommand
);
exports.default = ShopCommand;
//# sourceMappingURL=shop.js.map
