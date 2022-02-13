'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OwOCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const stringManipulation_1 = require('../../helpers/stringManipulation');
let OwOCommand = class OwOCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const textToOwoify = interaction.options.getString('text_to_owoify');
		return interaction.reply((0, stringManipulation_1.owoify)(textToOwoify));
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('text_to_owoify').setDescription('The text to owoify.').setRequired(true)
				)
		);
	}
};
OwOCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'owofy',
			description: 'Only for the true owoers.',
			detailedDescription: 'owo <string>'
		})
	],
	OwOCommand
);
exports.OwOCommand = OwOCommand;
//# sourceMappingURL=owoify.js.map
