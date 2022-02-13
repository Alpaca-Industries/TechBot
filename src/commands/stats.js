'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StatsCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const common_tags_1 = require('common-tags');
const dayjs_1 = (0, tslib_1.__importDefault)(require('dayjs'));
const discord_js_1 = require('discord.js');
let StatsCommand = class StatsCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const duration = (0, dayjs_1.default)(this.container.client.uptime).format(
			' D [days], H [hrs], m [mins], s [secs]'
		);
		const string = `
			= STATISTICS =
			• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
			• Uptime     :: ${duration}
			• Users      :: ${this.container.client.users.cache.size.toLocaleString()}
			• Servers    :: ${this.container.client.guilds.cache.size.toLocaleString()}
			• Channels   :: ${this.container.client.channels.cache.size.toLocaleString()}
			• Discord.js :: v${discord_js_1.version}
			• Node       :: ${process.version}`;
		return interaction.reply({
			content: `\`\`\`asciidoc\n${(0, common_tags_1.stripIndents)(string)}\`\`\``
		});
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
StatsCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'stats',
			description: 'Shows some interesting stats about the bot.',
			detailedDescription: 'stats'
		})
	],
	StatsCommand
);
exports.StatsCommand = StatsCommand;
//# sourceMappingURL=stats.js.map
