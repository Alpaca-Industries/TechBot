import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { User } from '../../entities/economy/user';

@ApplyOptions<CommandOptions>({
	name: 'leaderboard',
	description: 'Shows the global economy leaderboard.',
	detailedDescription: 'leaderboard',
	flags: ['guildOnly', 'ownerOnly', 'bankOnly', 'overallMoney']
})
export default class LeaderboardCommand extends Command {
	private numToEnglish(number: number): string {
		const num = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
		if (number < 20) return num[number];
		const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

		const digit = number % 10;
		// 												Added strict if check here instead of ambiguous
		if (number < 100) return `${tens[~~(number / 10) - 2]}${digit !== 0 ? '-' + num[digit] : ''}`;
		// Changed return types to string so its actually clear whats returned
		if (number < 1000) return `${num[~~(number / 100)]} hundred ${number % 100 == 0 ? '' : ' ' + this.numToEnglish(number % 100)}`;
		return `${this.numToEnglish(~~(number / 1000))} thousand ${number % 1000 != 0 ? ' ' + this.numToEnglish(number % 1000) : ''}`;
	}

	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const guildOnly = args.getFlags('guildOnly');
		const walletOnly = args.getFlags('walletOnly');
		const bankOnly = args.getFlags('bankOnly');
		const overallMoney = args.getFlags('overallMoney');

		if (guildOnly === true && walletOnly === true) {
			return message.channel.send('Please Only Specify Either Bank or Wallet or Overalll');
		}

		const topUsers = await User.createQueryBuilder('user').orderBy('user.wallet', 'DESC').limit(10).getMany();
		const leaderboardEmbed = new MessageEmbed();
		const leaderboardData: string[] = [];

		let counter = 1;
		for (const user of topUsers.filter((user) => {
			const filterOutUsersBelow0Condition = user.wallet + user.bank > 0;
			const guildOnlyCondition = guildOnly === true ? message.guild.members.fetch(user.id) : true;
			return filterOutUsersBelow0Condition && guildOnlyCondition;
		})) {
			const userInformation = await this.container.client.users.fetch(user.id);

			const valueForEmbed = () => {
				if (overallMoney === true) return user.wallet + user.bank;
				if (walletOnly === true) return user.wallet;
				if (bankOnly === true) return user.bank;
				return user.wallet;
			};

			switch (counter) {
				// Removed unecceary {} around case statements
				case 1:
					// Made all lines single lines so its actually readable, for the love of god change your max line length
					leaderboardData.push(`:first_place: • ${userInformation.tag} - ${valueForEmbed() ? valueForEmbed().toLocaleString() : 0}`);
					break;
				case 2:
					leaderboardData.push(`:second_place: • ${userInformation.tag} - ${valueForEmbed() ? valueForEmbed().toLocaleString() : 0}`);
					break;
				case 3:
					leaderboardData.push(`:third_place: • ${userInformation.tag} - ${valueForEmbed() ? valueForEmbed().toLocaleString() : 0}`);
					break;
				default:
					leaderboardData.push(`:${this.numToEnglish(counter)}: • ${userInformation.tag} - ${valueForEmbed() ? valueForEmbed().toLocaleString() : 0}`);
			}
			counter++;
		}

		leaderboardEmbed.setDescription(leaderboardData.join('\n'));
		return message.channel.send({ embeds: [leaderboardEmbed] });
	}
}
