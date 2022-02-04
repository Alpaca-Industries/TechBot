import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { owoify } from '../../helpers/stringManipulation';

@ApplyOptions<CommandOptions>({
	name: 'owofy',
	description: 'Only for the true owoers.',
	detailedDescription: 'owo <string>'
})
export class OwOCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const textToOwoify = interaction.options.getString('text_to_owoify');

		return interaction.reply(owoify(textToOwoify));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'text_to_owoify',
						type: 'STRING',
						description: 'The text to owoify.',
						required: true
					}
				]
			},
			{ idHints: ['929845422745350144'] }
		);
	}
}
