import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchUser, fetchItemByName } from '../../helpers/dbHelper';
import { generateEmbed, generateErrorEmbed } from '../../helpers/embeds';
import { getPrefix } from '../../helpers/getPrefix';
import { Guild, User } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	private async buyCommandLogic(
		itemToBuy: string,
		user: User,
		guild: Guild
	): Promise<PepeBoy.CommandLogic> {
		if (itemToBuy === '')
			return {
				ephemeral: true,
				content: '',
				embeds: [generateEmbed(this.description, `Usage: ${this.detailedDescription}`)]
			};

		const item = await fetchItemByName(itemToBuy.replaceAll(' ', '_'));
		if (item === undefined)
			return { ephemeral: true, content: '', embeds: [generateErrorEmbed('Invalid Item Specified!')] };
		const userData = await fetchUser(user);

		if (userData.wallet < item.price)
			return {
				ephemeral: true,
				content: '',
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${userData.wallet.toLocaleString()}\`.\nUsage: \`${await getPrefix(
							guild
						)}${this.detailedDescription}\``
					)
				]
			};

		userData.wallet -= item.price;
		await userData.save();

		fetchInventory(user, item).then((inventory) => {
			inventory.amount++;
			inventory.save();
		});

		return {
			ephemeral: false,
			embeds: [],
			content: `You bought **${item.name}** for **$${item.price.toLocaleString()}**`
		};
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const itemToBuy = await args.pick('string').catch(() => '');

		const logicReply = await this.buyCommandLogic(itemToBuy, message.author, message.guild);
		return message.reply({
			content: logicReply.content,
			embeds: logicReply.embeds
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		const itemToBuy = interaction.options.getString('item');

		const logicReply = await this.buyCommandLogic(itemToBuy, interaction.user, interaction.guild);
		return interaction.reply(logicReply);
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
