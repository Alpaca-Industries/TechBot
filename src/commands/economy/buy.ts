import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchUser, fetchItemByName } from '../../helpers/dbHelper';
import { generateEmbed, generateErrorEmbed } from '../../helpers/embeds';
import { getPrefix } from '../../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const itemToBuy = await args.rest('string').catch(() => '');

		if (itemToBuy === '')
			return message.channel.send({
				embeds: [generateEmbed(this.description, `Usage: ${this.detailedDescription}`)]
			});

		const item = await fetchItemByName(itemToBuy.replaceAll(' ', '_'));
		if (item === undefined)
			return message.reply({ embeds: [generateErrorEmbed('Invalid Item Specified!')] });
		const user = await fetchUser(message.author);

		if (user.wallet < item.price)
			return message.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${user.wallet.toLocaleString()}\`.\nUsage: \`${await getPrefix(
							message.guild
						)}${this.detailedDescription}\``
					)
				]
			});

		user.wallet -= item.price;
		user.save();

		fetchInventory(message.author, item).then((inventory) => {
			inventory.amount++;
			inventory.save();
		});

		return message.reply(`You bought **${item.name}** for **$${item.price.toLocaleString()}**`);
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
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
		user.save();

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
