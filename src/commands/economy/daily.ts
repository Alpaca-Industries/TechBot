import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'daily',
	description: 'Get those yummy pepe coins, I know you want them.',
    cooldownDelay: 86_400_000,
	detailedDescription: 'daily'
})
export default class DailyCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		const embed = new MessageEmbed();

		const moneyEarned = Math.round(
			Math.random() * (3000 - 750) + 750
		);

		fetchUser(message.author).then(user => {
			user.wallet += moneyEarned;
			user.save();
		});

		embed
			.setTitle('Daily Coins :D')
			.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tommorow.`)
			.setColor('BLUE')

		return message.channel.send({ embeds: [embed] });
	}
}