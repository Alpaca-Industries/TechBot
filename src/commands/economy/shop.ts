import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Item } from '../../entities/economy/item';
import { generateErrorEmbed } from '../../helpers/embeds';

@ApplyOptions<CommandOptions>({
	name: 'shop',
	description: 'Gives you a list of the buyable items and their prices.',
	detailedDescription: 'shop'
})
export default class ShopCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const specificItem = await args.pick('string').catch(() => '');

		if (specificItem.length > 0) {
			const item = await Item.findOne({ where: { name: specificItem.toProperCase() } });
			if (item !== undefined) {
				const embed = new MessageEmbed()
					.setTitle(item.name.toProperCase())
					.setDescription(`> ${item.description}\nPrice: $${item.price.toLocaleString()}`)
					.setColor('BLUE');
				return message.reply({ embeds: [embed] });
			} else {
				return message.reply({
					embeds: [
						generateErrorEmbed(
							`Could not find item with name '${specificItem}'.`,
							'Invalid Item Name'
						)
					]
				});
			}
		}
		const items = await Item.createQueryBuilder('item').orderBy('item.price', 'ASC').getMany();

		const embed = new MessageEmbed()
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

		return message.reply({ embeds: [embed] });
	}

	async chatInputRun(interaction: CommandInteraction) {
		const specificItem = interaction.options.getString('item') || '';
		if (specificItem.length > 0) {
			const item = await Item.findOne({ where: { name: specificItem.toProperCase() } });
			if (item !== undefined) {
				const embed = new MessageEmbed()
					.setTitle(item.name.toProperCase())
					.setDescription(`> ${item.description}\nPrice: $${item.price.toLocaleString()}`)
					.setColor('BLUE');
				return interaction.reply({ embeds: [embed] });
			} else {
				return interaction.reply({
					embeds: [
						generateErrorEmbed(
							`Could not find item with name '${specificItem}'.`,
							'Invalid Item Name'
						)
					],
					ephemeral: true
				});
			}
		}
		const items = await Item.createQueryBuilder('item').orderBy('item.price', 'ASC').getMany();

		const embed = new MessageEmbed()
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

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'item',
					type: 'STRING',
					description: 'the item to lookup.',
					required: false
				}
			]
		});
	}
}
