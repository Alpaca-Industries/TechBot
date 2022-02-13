'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateEmbed = exports.generateErrorEmbed = void 0;
const discord_js_1 = require('discord.js');
const generateErrorEmbed = (error, errorType = '') => {
	const errType = errorType !== '' ? `: ${errorType}` : '';
	return new discord_js_1.MessageEmbed()
		.setColor('#ED4245')
		.setTitle('Error' + errType)
		.setDescription(error);
};
exports.generateErrorEmbed = generateErrorEmbed;
const generateEmbed = (description, title, color = 'BLUE') => {
	return new discord_js_1.MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};
exports.generateEmbed = generateEmbed;
//# sourceMappingURL=embeds.js.map
