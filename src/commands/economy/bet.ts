import { generateEmbed } from './../../helpers/embeds';
import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
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
	async chatInputRun(interaction: CommandInteraction) {
		const userDetails = await fetchUser(interaction.user);
		const betAmount = parseAmount(interaction.options.getString('amount'), userDetails);

		if (betAmount < 10 || isNaN(betAmount))
			return interaction.reply('Please bet a valid amount above 10!');
		if (userDetails.wallet < betAmount)
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);

		const chance = Math.random() < 0.5;

		if (chance) {
			userDetails.wallet += betAmount;
			await userDetails.save();
			return interaction.reply({
				embeds: [
					generateEmbed(
						`Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`,
						'Bet Won',
						'DARK_GREEN'
					)
				]
			});
		} else {
			userDetails.wallet -= betAmount;
			await userDetails.save();
			return interaction.reply({
				embeds: [
					generateEmbed(
						`${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`,
						'Bet Lost',
						'RED'
					)
				]
			});
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
