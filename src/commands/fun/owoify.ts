import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { truncate } from 'lodash';
import { owoify } from '../../helpers/stringManipulation';

@ApplyOptions<CommandOptions>({
	name: 'owofy',
	description: 'Only for the true owoers.',
	detailedDescription: 'owo <string>'
})
export class OwOCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args): Promise<unknown> {
		const textToOwoify = await args.rest('string').catch(() => 'Provide text to OwOfy.');

		return message.channel.send(owoify(textToOwoify));
	}

	async chatInputRun(interaction: CommandInteraction) {
		const textToOwoify = interaction.options.getString('text_to_owoify');

		return interaction.reply(owoify(textToOwoify));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
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
		});
	}
}
