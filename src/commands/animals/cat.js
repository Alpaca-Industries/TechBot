'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const axios_1 = (0, tslib_1.__importDefault)(require('axios'));
let CatCommand = class CatCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const catEmbed = new discord_js_1.MessageEmbed();
		const cat = await axios_1.default
			.get('https://api.thecatapi.com/v1/images/search')
			.then((res) => res.data[0]);
		catEmbed.setImage(cat.url).setTitle('Cat').setURL(cat.url).setColor('BLUE');
		if (cat.breeds !== null && cat.breeds !== undefined) {
			catEmbed.setDescription(
				`Breed: ${cat.breeds[0].name}\nLife Span: ${cat.breeds[0].life_span}\nTemperament: ${cat.breeds[0].temperament}`
			);
		}
		return interaction.reply({ embeds: [catEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
CatCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'cat',
			description: 'Shows a cute cat image.',
			detailedDescription: 'cat'
		})
	],
	CatCommand
);
exports.default = CatCommand;
//# sourceMappingURL=cat.js.map
