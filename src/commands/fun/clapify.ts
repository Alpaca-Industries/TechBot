import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { replacer } from '../../helpers/replacer';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'clapify',
	aliases: ['clapfy'],
	description: 'Clapify your text.',
	detailedDescription: 'clapify <text>'
})
export default class clapifyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const text = interaction.options.getString('text');
		const user = await fetchUser(interaction.user);
		const emoji = await replacer(
			user.preferredEmojiColor,
			{
				default: '👏',
				pale: '👏🏻',
				cream_white: '👏🏼',
				brown: '👏🏽',
				dark_brown: '👏🏾',
				black: '👏🏿'
			},
			'g'
		);

		return interaction.reply(text.replace(/\s+/g, ` ${emoji} `));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'text',
					type: 'STRING',
					description: 'The text to clapify.',
					required: true
				}
			]
		});
	}
}
