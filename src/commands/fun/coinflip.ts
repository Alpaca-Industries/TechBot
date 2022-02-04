import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'coinflip',
	aliases: ['flip', 'coin-flip'],
	description: 'Flip a coin!',
	detailedDescription: 'coinflip'
})
export class CoinFlipCommand extends Command {
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
