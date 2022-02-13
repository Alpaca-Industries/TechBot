'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const guild_1 = require('../entities/guild');
let guildCreateListener = class guildCreateListener extends framework_1.Listener {
	run(guild) {
		guild_1.Guild.findOne({ where: { id: guild.id } }).then((dbGuild) => {
			if (dbGuild === undefined) {
				guild_1.Guild.create({
					id: guild.id,
					prefix: '-'
				}).save();
			}
		});
	}
};
guildCreateListener = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			event: 'guildCreate'
		})
	],
	guildCreateListener
);
exports.default = guildCreateListener;
//# sourceMappingURL=guildCreate.js.map
