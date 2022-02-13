'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const people = [
	'Alistair Douglas',
	'Franco Wilkerson',
	'Imaan Foreman',
	'Shazia Santana',
	'Zena Hodson',
	'Floyd Martins',
	'Solomon Webb',
	'Jamel Klein',
	'Raife Fields',
	'Ahsan Mora',
	'Arnie Stewart',
	'Aminah Mcclure',
	'Miranda Giles',
	'Elin Abbott',
	'Caitlin Michael',
	'Alice Espinosa',
	'Waqar Howe',
	'Tristan Leblanc',
	'Cadence Kane',
	'Reanne Lewis',
	'Oisin Hoover',
	'Roisin Bean',
	'Jak Ventura',
	'Bryony Power',
	'Saba Hartley'
];
const failedBegResponses = [
	'Your pathetic poor person.',
	'Go beg someone else!',
	'Back in the old days, we had to work for our money.'
];
let BegCommand = class BegCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const failedBegEmbed = new discord_js_1.MessageEmbed()
			.setAuthor({ name: people[Math.floor(people.length * Math.random())] })
			.setDescription(failedBegResponses[Math.floor(failedBegResponses.length * Math.random())])
			.setColor('RED');
		if (Math.random() > 0.5) return interaction.reply({ embeds: [failedBegEmbed] });
		const BegEmbed = new discord_js_1.MessageEmbed();
		const moneyEarned = Math.round(
			// people.length is the minimum amount and 600 is the maximum amount
			Math.random() * (600 - people.length) + (people.length - 1)
		);
		(0, dbHelper_1.fetchUser)(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});
		BegEmbed.setTitle(`You begged ${people[Math.floor(Math.random() * people.length)]} for money`)
			.setDescription(`💰While begging you earned $${moneyEarned.toLocaleString()}💰`)
			.setColor('BLUE');
		return interaction.reply({ embeds: [BegEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
BegCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'beg',
			description: 'Begs people for cash.',
			detailedDescription: 'beg'
		})
	],
	BegCommand
);
exports.default = BegCommand;
//# sourceMappingURL=beg.js.map
