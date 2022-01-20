import { generateEmbed } from './../../helpers/embeds';
import { generateErrorEmbed } from '../../helpers/embeds';
import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { parseAmount } from '../../helpers/parseAmount';
import { getPrefix } from '../../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const arg = await args.pick('string').catch(() => '');
		if (arg === '')
			return message.channel.send({
				embeds: [generateEmbed(this.description, `Usage: ${this.detailedDescription}`)]
			});

		const userDetails = await fetchUser(message.author);
		const betAmount = parseAmount(arg, userDetails);

		if (betAmount < 10 || isNaN(betAmount))
			return message.reply({
				embeds: [
					generateErrorEmbed(
						`Invalid amount '${arg}' provided.\n'amount' must be a valid integer that is above 10.\nUsage: \`${
							(await getPrefix(message.guild)) + this.detailedDescription
						}\``,
						'Invalid Amount'
					)
				]
			});
		if (userDetails.wallet < betAmount)
			return message.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to bet '${betAmount.toLocaleString()}'.\nYour bet of \`${betAmount}\` is greater than your wallet balance of \`${userDetails.wallet.toLocaleString()}\`\nUsage:\`${
							(await getPrefix(message.guild)) + this.detailedDescription
						}\``,
						'Missing Money'
					)
				]
			});

		const chance = Math.random() < 0.5 ? true : false;

		if (chance) {
			userDetails.wallet += betAmount;
			userDetails.save();
			return message.reply({
				embeds: [
					generateEmbed(
						`Congrats ${message.author.username}, you won **$${betAmount.toLocaleString()}**!`,
						'Bet Won',
						'DARK_GREEN'
					)
				]
			});
		} else {
			userDetails.wallet -= betAmount;
			userDetails.save();
			return message.reply({
				embeds: [
					generateEmbed(
						`${message.author.username}, you lost **$${betAmount.toLocaleString()}**!`,
						'Bet Lost',
						'RED'
					)
				]
			});
		}
	}

	async chatInputRun(interaction: CommandInteraction) {
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
			userDetails.save();
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
