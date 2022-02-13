import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
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
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('choices')
						.setRequired(true)
						.setDescription('The choices separated by ", "')
				)
		);
	}
}
