import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Item } from '../../entities/economy/item';
import type { Message } from 'discord.js';

import { MessageEmbed } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { User } from '../../entities/economy/user';

@ApplyOptions<CommandOptions>({
	name: 'inventory',
	description: "Shows a user's item inventory.",
	aliases: ['inv', 'bag', 'stuff'],
	detailedDescription: 'inventory [user]'
})
export default class InventoryCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const userToCheck = (await args.pickResult('user')).value || message.author;

		let items: ItemDataWithAmount[] = await User.getRepository().manager.query(`
			SELECT item.*, inventory.amount FROM item
			JOIN inventory ON inventory.itemID = item.id
			WHERE inventory.userId = ${userToCheck.id}
			`);
		const inventoryEmbed = new MessageEmbed();

		if (items.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return message.channel.send({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const item of items) {
			inventoryEmbed.addField(`${itemNumber}: ${item.name}`, `Price: ${item.price.toLocaleString()}\nRarity: ${item.rarity}\nAmount: ${item.amount.toLocaleString()}`);
			itemNumber++;
		}

		return message.channel.send({ embeds: [inventoryEmbed] });
	}
}

interface ItemDataWithAmount extends Item {
	amount: number;
}
