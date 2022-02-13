'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CommandDeniedListener = void 0;
const framework_1 = require('@sapphire/framework');
const embeds_1 = require('../helpers/embeds');
class CommandDeniedListener extends framework_1.Listener {
	run(error, { interaction }) {
		if (error.identifier === 'preconditionCooldown') {
			const { remaining } = error.context;
			const cooldownEmbed = (0, embeds_1.generateErrorEmbed)(
				`You can only use this command every ${this.humanizeTime(remaining)}`,
				error.identifier
			);
			return interaction.reply({ embeds: [cooldownEmbed] });
		}
		const errorEmbed = (0, embeds_1.generateErrorEmbed)(error.message, error.identifier);
		return interaction.reply({ embeds: [errorEmbed] });
	}
	humanizeTime(duration) {
		const portions = [];
		const msInHour = 1000 * 60 * 60;
		const hours = Math.trunc(duration / msInHour);
		if (hours > 0) {
			portions.push(hours + 'h');
			duration = duration - hours * msInHour;
		}
		const msInMinute = 1000 * 60;
		const minutes = Math.trunc(duration / msInMinute);
		if (minutes > 0) {
			portions.push(minutes + 'm');
			duration = duration - minutes * msInMinute;
		}
		const seconds = Math.trunc(duration / 1000);
		if (seconds > 0) {
			portions.push(seconds + 's');
		}
		return portions.join(' ');
	}
}
exports.CommandDeniedListener = CommandDeniedListener;
//# sourceMappingURL=chatInputCommandDenied.js.map
