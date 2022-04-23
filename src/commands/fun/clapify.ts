import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { replacer, fetchUser } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'clapify',
	description: 'Clapify your text.',
	detailedDescription: 'clapify <text>'
})
export default class clapifyCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const text = interaction.options.getString('text') as string;
		const user = await fetchUser(interaction.user);

		const emoji =
			replacer(
				user.preferredEmojiColor,
				{
					yellow: '👏', //deprecated
					default: '👏',
					pale: '👏🏻',
					cream_white: '👏🏼',
					brown: '👏🏽',
					dark_brown: '👏🏾',
					black: '👏🏿'
				},
				'g'
			) || '👏';

		return void interaction.reply(text.replace(/\s+/g, ` ${emoji} `));
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('text').setDescription('The text to clapify.').setRequired(true)),
			{ idHints: ['944645978382807071'] }
		);
	}
}
