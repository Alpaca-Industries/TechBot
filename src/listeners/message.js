'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
let messageListener = class messageListener extends framework_1.Listener {
	async run(message) {
		if (message.author.bot) return;
		if (message.content.startsWith(`<@!${message.client?.user?.id}>`)) {
			const embed = new discord_js_1.MessageEmbed()
				.setTitle('Hello!')
				.setDescription(
					`I am a bot created by Greysilly7#8813, Spen#0999, and Haider#8515.\n\nI am a bot that can be used to manage your server\'s economy.\n\nTo get started, use the command \`help\` to see a list of commands. \n\n My Prefix is **${await message.client.fetchPrefix(
						message
					)}**`
				)
				.setColor(0x00ff00);
			return message.channel.send({ embeds: [embed] });
		}
		return;
	}
};
messageListener = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			event: 'messageCreate'
		})
	],
	messageListener
);
exports.default = messageListener;
//# sourceMappingURL=message.js.map
