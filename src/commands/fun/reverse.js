'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ReverseCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let ReverseCommand = class ReverseCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const text_to_reverse = interaction.options.getString('text_to_reverse');
		return interaction.reply(
			text_to_reverse
				.split('')
				.reverse()
				.join('')
				.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options
						.setName('text_to_reverse')
						.setDescription('The text to reverse.')
						.setRequired(true)
				)
		);
	}
};
ReverseCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'reverse',
			description: 'Reverse your text.',
			detailedDescription: 'reverse <string>'
		})
	],
	ReverseCommand
);
exports.ReverseCommand = ReverseCommand;
//# sourceMappingURL=reverse.js.map
