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
		if (Math.floor(Math.random() * 2) === 1) return message.reply('Heads');
		if (Math.floor(Math.random() * 2) === 1) return message.reply('Tails');
		// @ts-ignore
		return;
	}

	async chatInputRun(interaction: CommandInteraction) {
		if (Math.floor(Math.random() * 2) === 1) return interaction.reply('Heads');
		if (Math.floor(Math.random() * 2) === 1) return interaction.reply('Tails');
		return;
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
