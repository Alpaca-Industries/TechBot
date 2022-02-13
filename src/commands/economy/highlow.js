'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const framework_1 = require('@sapphire/framework');
const dbHelper_1 = require('../../helpers/dbHelper');
let DailyCommand = class DailyCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const num = Math.floor(Math.random() * 100) + 1;
		const embed = new discord_js_1.MessageEmbed()
			.setDescription(
				`The first number is **${num}**.\nDo you think the second number will be \`higher\`, \`lower\`, or exactly (\`jackpot\`) it?`
			)
			.setColor('BLUE')
			.setTitle('Highlow Bet');
		const row = new discord_js_1.MessageActionRow().addComponents(
			new discord_js_1.MessageButton().setCustomId('lower').setLabel('Lower').setStyle('SECONDARY'),
			new discord_js_1.MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY'),
			new discord_js_1.MessageButton().setCustomId('higher').setLabel('Higher').setStyle('SECONDARY')
		);
		await interaction.reply({ content: 'Made highlow bet successfully!', ephemeral: true });
		const msg = await interaction.channel?.send({ embeds: [embed], components: [row] });
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const filter = (interaction) =>
			interaction.customId === 'higher' ||
			interaction.customId === 'jackpot' ||
			(interaction.customId === 'lower' && interaction.user.id === interaction.user.id);
		msg?.awaitMessageComponent({ filter, time: 30000 }).then((interaction) => {
			const bet = interaction.customId;
			const testNum = Math.floor(Math.random() * 100) + 1;
			let won;
			if (bet === 'higher' && num < testNum) {
				won = true;
			} else if (bet === 'lower' && num > testNum) {
				won = true;
			} else won = bet === 'jackpot' && num === testNum;
			let amount;
			if (bet === 'jackpot' && won) {
				amount = Math.round(Math.random() * (10000 - 2000) + 2000);
			} else {
				amount = Math.round(Math.random() * (800 - 75) + 75);
			}
			if (won === true) {
				user.wallet += amount;
			} else {
				user.wallet -= amount;
			}
			const newEmbed = new discord_js_1.MessageEmbed()
				.setTitle('Highlow')
				.setDescription(
					`You betted **${bet.toProperCase()}**, the first number was **${num}** and the second was **${testNum}**. So, you ${
						won ? 'won' : 'lost'
					} **$${amount}**.`
				)
				.setColor(won ? 'GREEN' : 'RED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
			interaction.reply({ embeds: [newEmbed] });
			msg.delete();
			//msg.edit({embeds: [newEmbed], components: [com]});
		});
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
};
DailyCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'highlow',
			description: 'Bet if a number is lower/higher/exactly a second number.',
			detailedDescription: 'highlow',
			aliases: ['hl']
		})
	],
	DailyCommand
);
exports.default = DailyCommand;
//# sourceMappingURL=highlow.js.map
