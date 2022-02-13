'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const index_1 = require('../../index');
let prefixCommand = class prefixCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const prefix = interaction.options.getString('prefix');
		index_1.prefixCache.set(interaction.guild.id, { creationDate: new Date(), prefix });
		await (0, dbHelper_1.fetchGuild)(interaction.guild).then((guild) => {
			guild.prefix = prefix;
			guild.save();
		});
		return interaction.reply(`Prefix changed to ${prefix}`);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options.setName('prefix').setRequired(true).setDescription('The new prefix.')
				)
		);
	}
};
prefixCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'prefix',
			description: 'Allows you to change the prefix of the bot.',
			requiredUserPermissions: ['MANAGE_GUILD'],
			detailedDescription: 'prefix [new prefix]'
		})
	],
	prefixCommand
);
exports.default = prefixCommand;
//# sourceMappingURL=prefix.js.map
