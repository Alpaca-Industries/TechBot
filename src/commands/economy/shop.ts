import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

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

		const generateEmbedItemData = (item: Item): string => {
			switch (item.name) {
				case 'Fishing_Pole':
					return '🎣 Fishing Pole | Price: ' + item.price.toLocaleString();
				case 'Scissors':
					return `✂️ Scissors | Price: ${item.price.toLocaleString()}`;
				case 'TV':
					return '📺 TV | Price: ' + item.price.toLocaleString();
				case 'Laptop':
					return '💻 MacBook | Price: ' + item.price.toLocaleString();
				case 'Grilled_Cheese':
					return '🍕 Grilled Cheese | Price: ' + item.price.toLocaleString();
				case 'Hunting_Rifle':
					return '🔫 Hunting Rifle | Price: ' + item.price.toLocaleString();
				case 'IPhone':
					return '📱 Phone | Price: ' + item.price.toLocaleString();
				case 'Helicopter':
					return '🚁 Helicopter | Price: ' + item.price.toLocaleString();
				case 'Golden_Chicken_Nuggets':
					return '🐔 Golden Chicken Nuggets | Price: ' + item.price.toLocaleString();
				default:
					return `${item.name.replaceAll('_', ' ')} | Price: ' + ${item.price.toLocaleString()}`;
			}
		};

		const embed = new MessageEmbed()
			.setTitle('Items For Sale')
			.setDescription(items.map((item) => generateEmbedItemData(item)).join('\n'))
			.setColor(0x00ff00);

		return message.channel.send({ embeds: [embed] });
	}
}
