'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const embeds_1 = require('../../helpers/embeds');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
let SettingCommand = class SettingCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const option = interaction.options.getString('string', true);
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		switch (option.toLowerCase()) {
			case 'emojicolor':
			case 'coloremoji':
				const toggle = interaction.options.getString('toggle', true);
				let colorName;
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
							(0, embeds_1.generateErrorEmbed)(
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
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('option').setRequired(true))
				.addStringOption((option) => option.setName('toggle').setRequired(false))
		);
	}
};
SettingCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'setting',
			description: 'Allows you to change your default emoji',
			detailedDescription: 'settings'
		})
	],
	SettingCommand
);
exports.default = SettingCommand;
//# sourceMappingURL=setting.js.map
