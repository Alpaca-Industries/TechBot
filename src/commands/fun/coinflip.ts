import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'coinflip',
	aliases: ['flip', 'coin-flip'],
	description: 'Flip a coin!',
	detailedDescription: 'coinflip'
})
export class CoinFlipCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		if (Math.random() > 0.5) return message.reply('Heads');
		else return message.reply('Tails');
	}

	async chatInputRun(interaction: CommandInteraction) {
		if (Math.random() > 0.5) return interaction.reply('Heads');
		else return interaction.reply('Tails');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
