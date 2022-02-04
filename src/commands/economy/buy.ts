import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchUser, fetchItemByName } from '../../helpers/dbHelper';
import { getPrefix } from '../../helpers/getPrefix';
import { generateErrorEmbed } from '../../helpers/embeds';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const itemToBuy = interaction.options.getString('item');

		const item = await fetchItemByName(itemToBuy.replaceAll(' ', '_'));
		if (item === undefined)
			return interaction.reply({
				embeds: [generateErrorEmbed(`Invalid item \'${itemToBuy}\' specified!`, 'Invalid Item Name')]
			});
		const user = await fetchUser(interaction.user);

		if (user.wallet < item.price)
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${user.wallet.toLocaleString()}\`.\nUsage: \`${await getPrefix(
							interaction.guild
						)}${this.detailedDescription}\``
					)
				],
				ephemeral: true
			});

		user.wallet -= item.price;
		await user.save();

		fetchInventory(interaction.user, item).then((inventory) => {
			inventory.amount++;
			inventory.save();
		});

		return interaction.reply(`You bought **${item.name}** for **$${item.price.toLocaleString()}**`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'item',
					type: 'STRING',
					description: 'The item to buy.',
					required: true
				}
			]
		});
	}
}
