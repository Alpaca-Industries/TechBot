'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.HowGayCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let HowGayCommand = class HowGayCommand extends framework_1.Command {
	chatInputRun(interaction) {
		const user = interaction.options.getUser('user', false) || interaction.user;
		if (user.id === interaction.user.id)
			return interaction.reply(`You are **${Math.floor(Math.random() * 110)}%** gay! 🏳️‍🌈`);
		return interaction.reply(`${user.tag} is **${Math.floor(Math.random() * 110)}%** gay! 🏳️‍🌈`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options
						.setName('user')
						.setDescription('The user to get the gay percentage for.')
						.setRequired(false)
				)
		);
	}
};
HowGayCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'howgay',
			aliases: ['how-gay'],
			description: 'How gay are you?',
			detailedDescription: 'howgay [user]'
		})
	],
	HowGayCommand
);
exports.HowGayCommand = HowGayCommand;
//# sourceMappingURL=howgay.js.map
