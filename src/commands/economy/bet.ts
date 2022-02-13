import { generateEmbed } from '../../helpers/embeds';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
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
		const betAmount = parseAmount(interaction.options.getString('amount') as string, userDetails);

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
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('amount').setDescription('The amount of money to bet.').setRequired(true)
				)
		);
	}
}
