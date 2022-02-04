import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'reverse',
	description: 'Reverse your text.',
	detailedDescription: 'reverse <string>'
})
export class ReverseCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const text_to_reverse = interaction.options.getString('text_to_reverse');
		return interaction.reply(
			text_to_reverse
				.split('')
				.reverse()
				.join('')
				.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'text_to_reverse',
						type: 'STRING',
						description: 'The text to reverse.',
						required: true
					}
				]
			},
			{ idHints: ['929845337718411264'] }
		);
	}
}
