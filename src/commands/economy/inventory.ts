import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { Item } from '../../entities/economy/item';
import type { CommandInteraction, Message } from 'discord.js';

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
	async messageRun(message: Message<boolean>, args: Args) {
		const userToCheck = await args.pick('user').catch(() => message.author);

		const items: ItemDataWithAmount[] = await User.getRepository().manager.query(`
			SELECT item.*, inventory.amount FROM item
			JOIN inventory ON inventory.itemID = item.id
			WHERE inventory.userId = ${userToCheck.id}
			`);
		const inventoryEmbed = new MessageEmbed();

		if (items.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return message.reply({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const item of items) {
			inventoryEmbed.addField(`${itemNumber}: ${item.name}`, `Price: ${item.price.toLocaleString()}\nRarity: ${item.rarity}\nAmount: ${item.amount.toLocaleString()}`);
			itemNumber++;
		}

		return message.reply({ embeds: [inventoryEmbed] });
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToCheck = interaction.options.getUser('user') || interaction.user;

		const items: ItemDataWithAmount[] = await User.getRepository().manager.query(`
			SELECT item.*, inventory.amount FROM item
			JOIN inventory ON inventory.itemID = item.id
			WHERE inventory.userId = ${userToCheck.id}
			`);
		const inventoryEmbed = new MessageEmbed();

		if (items.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const item of items) {
			inventoryEmbed.addField(`${itemNumber}: ${item.name}`, `Price: ${item.price.toLocaleString()}\nRarity: ${item.rarity}\nAmount: ${item.amount.toLocaleString()}`);
			itemNumber++;
		}

		return interaction.reply({ embeds: [inventoryEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The user to check the inventory of.',
						required: false
					}
				]
			},
			{ idHints: ['930278952549900339'] }
		);
	}
}

interface ItemDataWithAmount extends Item {
	amount: number;
}
