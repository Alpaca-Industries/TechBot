import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const betAmount = await args.pick('integer').catch(() => 0);
		if (betAmount < 10 || isNaN(betAmount)) {
			return message.reply('Please bet a valid amount above 10!');
		}

		const userDetails = await fetchUser(message.author);

		if (userDetails.wallet < betAmount) {
			return message.reply(`Sorry ${message.author.username}, you don't have enough money!`);
		}

		const chance = Math.random() < 0.5 ? true : false;

		if (chance) {
			userDetails.wallet += betAmount;
			userDetails.save();
			return message.reply(`Congrats ${message.author.username}, you won **$${betAmount.toLocaleString()}**!`);
		} else {
			userDetails.wallet -= betAmount;
			userDetails.save();
			return message.reply(`${message.author.username}, you lost **$${betAmount.toLocaleString()}**!`);
		}
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const betAmount = interaction.options.getInteger('bet_amount');
		if (betAmount < 10 || isNaN(betAmount)) {
			return interaction.reply('Please bet a valid amount above 10!');
		}

		const userDetails = await fetchUser(interaction.user);

		if (userDetails.wallet < betAmount) {
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);
		}

		const chance = Math.random() < 0.5 ? true : false;

		if (chance) {
			userDetails.wallet += betAmount;
			userDetails.save();
			return interaction.reply(`Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`);
		} else {
			userDetails.wallet -= betAmount;
			userDetails.save();
			return interaction.reply(`${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`);
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'bet_amount',
					type: 'INTEGER',
					description: 'The amount to bet.',
					required: true
				}
			]
		});
	}
}
