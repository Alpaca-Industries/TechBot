'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const user_1 = require('../../entities/economy/user');
let LeaderboardCommand = class LeaderboardCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const flags = interaction.options.getString('flags', true).split('--');
		const guildOnly = flags.includes('guildOnly');
		const walletOnly = flags.includes('walletOnly');
		const bankOnly = flags.includes('bankOnly');
		const overallMoney = flags.includes('overallMoney');
		if (guildOnly === true && walletOnly === true) {
			return interaction.reply('Please Only Specify Either Bank or Wallet or Overalll');
		}
		const topUsers = await user_1.User.createQueryBuilder('user')
			.orderBy('user.wallet', 'DESC')
			.limit(10)
			.getMany();
		const leaderboardEmbed = new discord_js_1.MessageEmbed();
		const leaderboardData = [];
		let counter = 1;
		const validUsers = topUsers.filter((user) => {
			if (user.wallet + user.bank < 0) return false;
			if (!guildOnly) return false;
			return true;
		});
		for (const user of validUsers) {
			const userInformation = await this.container.client.users.fetch(user.id);
			const valueForEmbed = () => {
				if (overallMoney) return user.wallet + user.bank;
				if (bankOnly) return user.bank;
				return user.wallet;
			};
			switch (counter) {
				// Removed unecceary {} around case statements
				case 1:
					// Made all lines single lines so its actually readable, for the love of god change your max line length
					leaderboardData.push(
						`:first_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				case 2:
					leaderboardData.push(
						`:second_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				case 3:
					leaderboardData.push(
						`:third_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				default:
					leaderboardData.push(
						`:${this.numToEnglish(counter)}: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
			}
			counter++;
		}
		leaderboardEmbed.setDescription(leaderboardData.join('\n'));
		return interaction.reply({ embeds: [leaderboardEmbed] });
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('flags')
						.setDescription('Flags to use')
						.setChoices([
							['Only show guilds', 'guildOnly'],
							['Only show wallets', 'walletOnly'],
							['Only show banks', 'bankOnly'],
							['Show overall money', 'overallMoney']
						])
				)
		);
	}
	numToEnglish(number) {
		const num = [
			'zero',
			'one',
			'two',
			'three',
			'four',
			'five',
			'six',
			'seven',
			'eight',
			'nine',
			'ten',
			'eleven',
			'twelve',
			'thirteen',
			'fourteen',
			'fifteen',
			'sixteen',
			'seventeen',
			'eighteen',
			'nineteen'
		];
		if (number < 20) return num[number];
		const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
		const digit = number % 10;
		// 												Added strict if check here instead of ambiguous
		if (number < 100) return `${tens[~~(number / 10) - 2]}${digit !== 0 ? '-' + num[digit] : ''}`;
		// Changed return types to string so its actually clear whats returned
		if (number < 1000)
			return `${num[~~(number / 100)]} hundred ${
				number % 100 == 0 ? '' : ' ' + this.numToEnglish(number % 100)
			}`;
		return `${this.numToEnglish(~~(number / 1000))} thousand ${
			number % 1000 != 0 ? ' ' + this.numToEnglish(number % 1000) : ''
		}`;
	}
};
LeaderboardCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'leaderboard',
			description: 'Shows the global economy leaderboard.',
			detailedDescription: 'leaderboard',
			flags: ['guildOnly', 'ownerOnly', 'bankOnly', 'overallMoney']
		})
	],
	LeaderboardCommand
);
exports.default = LeaderboardCommand;
//# sourceMappingURL=leaderboard.js.map
