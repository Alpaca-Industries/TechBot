'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ChooseCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
let ChooseCommand = class ChooseCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const optionsArray = [
			'Yes!',
			'No!',
			'Nope!',
			'Go ask a friend.',
			'It seems so.',
			'For sure.',
			'Maybe.',
			'Of course!',
			'Nah',
			'Possibly',
			'That seems correct.'
		];
		return interaction.reply(`:8ball: ${optionsArray[Math.floor(Math.random() * optionsArray.length)]}`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('question').setDescription('The question to ask').setRequired(true)
				)
		);
	}
};
ChooseCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: '8ball',
			description: 'RNG chooses your fate.',
			detailedDescription: '8ball <question>'
		})
	],
	ChooseCommand
);
exports.ChooseCommand = ChooseCommand;
//# sourceMappingURL=8ball.js.map
