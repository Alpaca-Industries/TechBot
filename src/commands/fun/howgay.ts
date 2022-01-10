import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'howgay',
	aliases: ['how-gay'],
	description: 'How gay are you?',
	detailedDescription: 'howgay [user]'
})
export class HowGayCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await args.pick('user').catch(() => message.author);
		if (user.id === message.author.id) return message.channel.send(`You are **${Math.floor(Math.random() * 110)}%** gay`);
		return message.channel.send(`${user.tag} is **${Math.floor(Math.random() * 110)}%** gay`);
	}

	chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user', false) || interaction.user;
		if (user.id === interaction.user.id) return interaction.reply(`You are **${Math.floor(Math.random() * 110)}%** gay`);
		return interaction.reply(`${user.tag} is **${Math.floor(Math.random() * 110)}%** gay`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The text to owoify.',
					required: false
				}
			]
		});
	}
}
