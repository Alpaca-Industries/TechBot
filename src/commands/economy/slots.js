'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const parseAmount_1 = require('../../helpers/parseAmount');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
let SlotsCommand = class SlotsCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		const amount = (0, parseAmount_1.parseAmount)(interaction.options.getString('amount'), user, true);
		if (amount < 20) return interaction.reply('Please gamble a proper amount, a.k.a above 20');
		if (user.wallet < amount) return interaction.reply('You dont have enough money...');
		const guild = await (0, dbHelper_1.fetchGuild)(interaction.guild);
		const slotEmoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];
		const randomNumber = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
		const firstRoll = items[Math.floor(items.length * Math.random())];
		const secondRoll =
			guild.slotsWinMultiplier < randomNumber
				? items[Math.floor(items.length * Math.random())]
				: firstRoll;
		const thirdRoll =
			guild.slotsWinMultiplier < randomNumber
				? items[Math.floor(items.length * Math.random())]
				: firstRoll;
		const play = new discord_js_1.MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotEmoji + '  ' + slotEmoji + '  ' + slotEmoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });
		const firstRollEmbed = new discord_js_1.MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${slotEmoji}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });
		const secondRollEmbed = new discord_js_1.MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });
		const thirdRollEmbed = new discord_js_1.MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${thirdRoll} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });
		await interaction.reply({ embeds: [play] });
		setTimeout(() => {
			interaction.editReply({ embeds: [firstRollEmbed] });
		}, 600);
		setTimeout(() => {
			interaction.editReply({ embeds: [secondRollEmbed] });
		}, 1200);
		setTimeout(() => {
			interaction.editReply({ embeds: [thirdRollEmbed] });
		}, 1800);
		if (firstRoll === secondRoll && firstRoll === thirdRoll) {
			setTimeout(async () => {
				const moneyEarned = guild.slotsMoneyPool;
				user.wallet += moneyEarned;
				await user.save();
				guild.slotsMoneyPool = 0;
				guild.slotsWinMultiplier = 0;
				await guild.save();
				return interaction.followUp({ content: `CONGRATS! You won **$${moneyEarned}**` });
			}, 2000);
		} else {
			setTimeout(async () => {
				guild.slotsWinMultiplier++;
				guild.slotsMoneyPool += amount;
				await guild.save();
				return interaction.followUp({ content: 'Sorry, you lost your money!' });
			}, 2000);
		}
		return null;
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money you want to gamble')
						.setRequired(true)
				)
		);
	}
};
SlotsCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'slots',
			description: 'Lets you gamble your money in a slot machine',
			detailedDescription: 'slots <amount>'
		})
	],
	SlotsCommand
);
exports.default = SlotsCommand;
//# sourceMappingURL=slots.js.map
