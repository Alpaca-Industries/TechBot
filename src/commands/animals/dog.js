'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const axios_1 = (0, tslib_1.__importDefault)(require('axios'));
let DogCommand = class DogCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const dogEmbed = new discord_js_1.MessageEmbed();
		const dog = await axios_1.default
			.get('https://api.thedogapi.com/v1/images/search')
			.then((res) => res.data[0]);
		dogEmbed.setImage(dog.url);
		if (dog.breeds !== null && dog.breeds !== undefined) {
			dogEmbed.setFooter({
				text: `Breed: ${dog.breeds[0].name} | life-span: ${dog.breeds[0].life_span} | Temperament: ${dog.breeds[0].temperament}`
			});
		}
		return interaction.reply({ embeds: [dogEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
DogCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'dog',
			description: 'Shows a cute dog image.',
			detailedDescription: 'dog'
		})
	],
	DogCommand
);
exports.default = DogCommand;
//# sourceMappingURL=dog.js.map
