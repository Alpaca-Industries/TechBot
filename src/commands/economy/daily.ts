import { Message, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'daily',
	description: 'Get those yummy pepe coins, I know you want them.',
	cooldownDelay: 86_400_000,
	detailedDescription: 'daily'
})
export default class DailyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const embed = new MessageEmbed();
		const moneyEarned = Math.round(Math.random() * (3000 - 750) + 750);

		fetchUser(message.author).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		embed
			.setTitle('Daily Coins :D')
			.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tommorow.`)
			.setColor('BLUE');

		return message.channel.send({ embeds: [embed] });
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const embed = new MessageEmbed();
		const moneyEarned = Math.round(Math.random() * (3000 - 750) + 750);

		fetchUser(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		embed
			.setTitle('Daily Coins :D')
			.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tommorow.`)
			.setColor('BLUE');

		return interaction.reply({ embeds: [embed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
