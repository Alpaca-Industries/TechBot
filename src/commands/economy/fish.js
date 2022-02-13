'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StatsCommand = void 0;
const tslib_1 = require('tslib');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const dbHelper_1 = require('../../helpers/dbHelper');
let StatsCommand = class StatsCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const doesUserHaveFishingPole = await (0, dbHelper_1.fetchInventory)(
			interaction.user,
			await (0, dbHelper_1.fetchItemByName)('fishing_pole')
		);
		if (doesUserHaveFishingPole.amount === 0) return interaction.reply('You do not have a fishing pole!');
		const fishing_success = !!Math.random();
		if (fishing_success) {
			const fish = await (0, dbHelper_1.fetchItemByName)('fish');
			(0, dbHelper_1.fetchInventory)(interaction.user, fish).then(async (inventory) => {
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);
				inventory.amount += fish_amount;
				await inventory.save();
			});
			return interaction.reply(`You caught a ${fish.name}!`);
		} else return interaction.reply('You failed to catch anything!');
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
			name: 'fish',
			description: 'Lets you fish!',
			detailedDescription: ''
		})
	],
	StatsCommand
);
exports.StatsCommand = StatsCommand;
//# sourceMappingURL=fish.js.map
