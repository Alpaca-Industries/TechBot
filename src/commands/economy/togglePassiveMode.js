'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
let togglePassiveModeCommand = class togglePassiveModeCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const newValue = interaction.options.getBoolean('new_mode');
		if (newValue === null) return interaction.reply('You need to specify a boolean!');
		(0, dbHelper_1.fetchUser)(interaction.user).then((user) => {
			user.passiveMode = newValue;
			user.save();
		});
		return interaction.reply(`Your passive mode has been set to **${newValue}**!`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) =>
					option
						.setName('new_mode')
						.setDescription('The new value of passive mode')
						.setRequired(true)
				)
		);
	}
};
togglePassiveModeCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'passiveModeToggle',
			description: 'Lets you disable/enable the ability to be robbed',
			detailedDescription: 'passivemodetoggle <bool>'
		})
	],
	togglePassiveModeCommand
);
exports.default = togglePassiveModeCommand;
//# sourceMappingURL=togglePassiveMode.js.map
