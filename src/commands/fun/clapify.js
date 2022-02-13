'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const replacer_1 = require('../../helpers/replacer');
const dbHelper_1 = require('../../helpers/dbHelper');
let clapifyCommand = class clapifyCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const text = interaction.options.getString('text');
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const emoji = (0, replacer_1.replacer)(
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
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('text').setDescription('The text to clapify.').setRequired(true)
				)
		);
	}
};
clapifyCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'clapify',
			aliases: ['clapfy'],
			description: 'Clapify your text.',
			detailedDescription: 'clapify <text>'
		})
	],
	clapifyCommand
);
exports.default = clapifyCommand;
//# sourceMappingURL=clapify.js.map
