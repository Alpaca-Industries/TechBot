import { generateErrorEmbed } from './../../helpers/logging';
import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { parseAmount } from '../../helpers/parseAmount';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const userDetails = await fetchUser(message.author);
		const betAmount = parseAmount(await args.pick('string'), userDetails);

		if (betAmount < 10 || isNaN(betAmount))
			return message.reply({
				embeds: [
					generateErrorEmbed(
						"Invalid amount provided.\n'amount' must be a valid integer that is above 10.",
						'Invalid Amount'
					)
				]
			});
		if (userDetails.wallet > betAmount)
			return message.reply(`Sorry ${message.author.username}, you don't have enough money!`);

		const chance = Math.random() < 0.5 ? true : false;

		if (chance) {
			userDetails.wallet += betAmount;
			userDetails.save();
			return message.reply(
				`Congrats ${message.author.username}, you won **$${betAmount.toLocaleString()}**!`
			);
		} else {
			userDetails.wallet -= betAmount;
			userDetails.save();
			return message.reply(`${message.author.username}, you lost **$${betAmount.toLocaleString()}**!`);
		}
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const userDetails = await fetchUser(interaction.user);
		const betAmount = parseAmount(interaction.options.getString('amount'), userDetails);

		if (betAmount < 10 || isNaN(betAmount))
			return interaction.reply('Please bet a valid amount above 10!');
		if (userDetails.wallet < betAmount)
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);

		const chance = Math.random() < 0.5 ? true : false;

		if (chance) {
			userDetails.wallet += betAmount;
			userDetails.save();
			return interaction.reply(
				`Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`
			);
		} else {
			userDetails.wallet -= betAmount;
			userDetails.save();
			return interaction.reply(
				`${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`
			);
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'amount',
						type: 'STRING',
						description: 'The amount to bet.',
						required: true
					}
				]
			},
			{ idHints: ['930278866277253170'] }
		);
	}
}
