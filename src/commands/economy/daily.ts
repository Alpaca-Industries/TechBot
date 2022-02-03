import { Message, MessageEmbed, User } from 'discord.js';
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
	private async dailyCommandLogic(user: User): Promise<PepeBoy.CommandLogic> {
		const moneyEarned = Math.round(Math.random() * (3000 - 750) + 750);

		fetchUser(user).then((userData) => {
			userData.wallet += moneyEarned;
			userData.save();
		});

		return {
			ephemeral: false,
			embeds: [
				new MessageEmbed()
					.setTitle('Daily Coins :D')
					.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tomorrow.`)
					.setColor('BLUE')
			]
		};
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const logicReply = await this.dailyCommandLogic(message.author);

		return message.reply({
			content: logicReply.content,
			embeds: logicReply.embeds
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.dailyCommandLogic(interaction.user));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
