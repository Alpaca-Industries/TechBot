import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { fetchInventory, fetchItemByName, fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';

@ApplyOptions<CommandOptions>({
	name: 'sell',
	description: 'Sell an item.',
	detailedDescription: 'sell <item> <amount>'
})
export class SellCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const item = (interaction.options.getString('item') as string).replaceAll(' ', '_');
		const amount = Number(interaction.options.getString('amount'));
		const user = await fetchUser(interaction.user);

		await fetchInventory(interaction.user, await fetchItemByName(item)).then(async (inventory) => {
			const userItem = await fetchItemByName(item);
			if (!userItem.sellable) return interaction.reply('Item is not sellable!');
			if (inventory === undefined) return interaction.reply('You do not have that item');
			if (inventory.amount < amount)
				return interaction.reply({
					embeds: [generateErrorEmbed('You do not have that much of that item!')]
				});
			inventory.amount -= amount;
			await inventory.save();

			user.wallet += Math.trunc(userItem.price / 2);
			await user.save();

			return interaction.reply(
				`Sold **${amount}** of **${item}** for **$${Math.trunc(
					userItem.price / 2
				).toLocaleString()}**.`
			);
		});
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('item').setRequired(true).setDescription('The item to sell.')
				)
				.addStringOption((option) =>
					option.setName('amount').setRequired(true).setDescription('The amount to sell.')
				)
		);
	}
}