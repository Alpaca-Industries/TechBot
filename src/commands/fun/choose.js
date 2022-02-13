'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ChooseCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const clean_1 = require('../../helpers/clean');
let ChooseCommand = class ChooseCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		let arg = interaction.options.getString('choices', true);
		const splitArg = arg.split(/,\s?/g);
		return interaction.reply((0, clean_1.clean)(splitArg[Math.floor(Math.random() * splitArg.length)]));
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('choices')
						.setRequired(true)
						.setDescription('The choices separated by ", "')
				)
		);
	}
};
ChooseCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'choose',
			description: 'Chooses a argument from a string randomly.',
			detailedDescription: 'choose <string>, ...'
		})
	],
	ChooseCommand
);
exports.ChooseCommand = ChooseCommand;
//# sourceMappingURL=choose.js.map
