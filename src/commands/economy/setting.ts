import { generateErrorEmbed } from '../../helpers/embeds';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'setting',
	description: 'Allows you to change your default emoji',
	detailedDescription: 'settings'
})
export default class SettingCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const option = interaction.options.getString('string', true);
		const user = await fetchUser(interaction.user);

		switch (option.toLowerCase()) {
			case 'emojicolor':
			case 'coloremoji':
				const toggle = interaction.options.getString('toggle', true);
				let colorName: string | null;
				switch (toggle) {
					case 'default':
					case 'yellow':
						user.preferredEmojiColor = 'default';
						colorName = 'default';
						break;
					case 'pale':
					case 'white':
						user.preferredEmojiColor = 'pale';
						colorName = 'pale';
						break;
					case 'cream':
					case 'cream white':
						user.preferredEmojiColor = 'cream_white';
						colorName = 'cream_white';
						break;
					case 'brown':
						user.preferredEmojiColor = 'brown';
						colorName = 'brown';
						break;
					case 'dark brown':
						user.preferredEmojiColor = 'dark_brown';
						colorName = 'dark_brown';
						break;
					case 'black':
					case 'dark':
						user.preferredEmojiColor = 'black';
						colorName = 'black';
						break;
					default:
						colorName = null;
				}
				if (toggle === '' || colorName === null)
					return interaction.reply({
						embeds: [
							generateErrorEmbed(
								`Invalid preferred emoji color name '${toggle}' provided as the second argument.\nValid options: \`default\`, \`pale\`, \`cream white\`, \`brown\`, \`dark brown\`, \`black\``
							)
						]
					});

				await user.save();
				await interaction.reply(
					`Changed your preferred emoji color to **${colorName.toProperCase()}**.`
				);
				break;
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('option').setRequired(true))
				.addStringOption((option) => option.setName('toggle').setRequired(false))
		);
	}
}
