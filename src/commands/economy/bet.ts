import { generateEmbed } from './../../helpers/embeds';
import { generateErrorEmbed } from '../../helpers/embeds';
import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { parseAmount } from '../../helpers/parseAmount';
import { getPrefix } from '../../helpers/getPrefix';
import { Guild, User } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	private async betCommandLogic(amount: string, user: User, guild: Guild): Promise<PepeBoy.CommandLogic> {
		if (amount === '') {
			return {
				ephemeral: true,
				embeds: [generateEmbed(this.description, `Usage: ${this.detailedDescription}`)]
			};
		}

		const userDetails = await fetchUser(user);
		const betAmount = parseAmount(amount, userDetails);

		if (betAmount < 10 || isNaN(betAmount)) {
			return {
				ephemeral: true,
				embeds: [
					generateErrorEmbed(
						`Invalid amount '${amount}' provided.\n'amount' must be a valid integer that is above 10.\nUsage: \`${
							(await getPrefix(guild)) + this.detailedDescription
						}\``,
						'Invalid Amount'
					)
				]
			};
		}
		if (userDetails.wallet < betAmount)
			return {
				ephemeral: true,
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to bet '${betAmount.toLocaleString()}'.\nYour bet of \`${betAmount}\` is greater than your wallet balance of \`${userDetails.wallet.toLocaleString()}\`\nUsage:\`${
							(await getPrefix(guild)) + this.detailedDescription
						}\``,
						'Missing Money'
					)
				]
			};

		const chance = Math.random() < 0.5;

		if (chance) {
			userDetails.wallet += betAmount;
			await userDetails.save();
			return {
				ephemeral: false,
				embeds: [
					generateEmbed(
						`Congrats ${user.username}, you won **$${betAmount.toLocaleString()}**!`,
						'Bet Won',
						'DARK_GREEN'
					)
				]
			};
		} else {
			userDetails.wallet -= betAmount;
			await userDetails.save();
			return {
				ephemeral: false,
				embeds: [
					generateEmbed(
						`${user.username}, you lost **$${betAmount.toLocaleString()}**!`,
						'Bet Lost',
						'RED'
					)
				]
			};
		}
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const arg = await args.pick('string').catch(() => '');

		const logicReply = await this.betCommandLogic(arg, message.author, message.guild);
		return message.reply(logicReply);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const logicReply = await this.betCommandLogic(
			interaction.options.getString('amount'),
			interaction.user,
			interaction.guild
		);
		return interaction.reply(logicReply);
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
