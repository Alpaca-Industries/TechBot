import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { clean } from '../../helpers/clean';

@ApplyOptions<CommandOptions>({
	name: 'choose',
	description: 'Chooses a argument from a string randomly.',
	detailedDescription: 'choose <string>, ...'
})
export class ChooseCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		let arg = interaction.options.getString('choices', true);
		const splitArg = arg.split(/,\s?/g);
		return interaction.reply(clean(splitArg[Math.floor(Math.random() * splitArg.length)]));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'choices',
					type: 'STRING',
					description: 'The choices separated by ", "',
					required: true
				}
			]
		});
	}
}
