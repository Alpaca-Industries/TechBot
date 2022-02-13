'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const embeds_1 = require('../../helpers/embeds');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
let WorkCommand = class WorkCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const workEmbed = new discord_js_1.MessageEmbed();
		const job = user.currentJob;
		if (job === 'jobless')
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						"You don't have a job! Do `job select janitor` to get started!",
						'No Job'
					)
				]
			});
		const jobs = {
			jobless: 0,
			janitor: 250,
			chief: 500,
			fire_fighter: 750,
			pepe_king: 1000
		};
		let moneyEarned = jobs[job.toLowerCase()];
		user.wallet += moneyEarned;
		await user.save();
		workEmbed
			.setTitle(`You worked as a ${job.toProperCase()}`)
			.setDescription(`While working you earned **$${moneyEarned.toLocaleString()}**.`)
			.setColor('BLUE');
		return interaction.reply({ embeds: [workEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
WorkCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'work',
			description: 'Makes you slave away your final days on earth :)',
			detailedDescription: 'work'
		})
	],
	WorkCommand
);
exports.default = WorkCommand;
//# sourceMappingURL=work.js.map
