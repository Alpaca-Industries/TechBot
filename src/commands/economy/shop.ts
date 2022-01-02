import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Item } from '../../entities/economy/item';

@ApplyOptions<CommandOptions>({
	name: 'shop',
	description: 'Gives you a list of the buyable items and their prices.',
	detailedDescription: 'shop'
})
export default class ShopCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const specificItem = await args.pickResult('string');
		if (specificItem.success) {
			const item = await Item.findOne({ where: { name: specificItem.value } });
			if (item !== undefined) {
				const embed = new MessageEmbed().setTitle(item.name).setDescription(`Price: ${item.price}`).setColor(0x00ff00);
				return message.channel.send({ embeds: [embed] });
			}
		}
		const items = await Item.createQueryBuilder('item').orderBy('item.price', 'ASC').getMany();

		const embed = new MessageEmbed()
			.setTitle('Items For Sale')
			.setDescription(items.map((item) => `${item.emoji} **${item.name}** - $${item.price.toLocaleString()}`).join('\n'))
			.setColor(0x00ff00);

		return message.channel.send({ embeds: [embed] });
	}
}
