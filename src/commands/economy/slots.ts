import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild, fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'slots',
	description: 'Lets you gamble your money in a slot machine',
	detailedDescription: 'slots [amount]'
})
export default class SlotsCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const { success: gambledAmountSuccess, value: gambledAmount } = await args.pickResult('integer');

		const user = await fetchUser(message.author);

		if (!gambledAmountSuccess || gambledAmount < 20) return message.channel.send('Please gamble a proper amount, a.k.a above 20');
		if (user.wallet < gambledAmount) return message.channel.send('You dont have enough money...');

		const guild = await fetchGuild(message.guild);

		const slotemoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];

		const $ = items[Math.floor(items.length * Math.random())];
		const $$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;
		const $$$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;

		const play = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotemoji + '  ' + slotemoji + '  ' + slotemoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });

		const $1 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${slotemoji}   ${slotemoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const $2 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${$$}   ${slotemoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const $3 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${$$}   ${$$$} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const spinner = await message.channel.send({ embeds: [play] });
		setTimeout(() => {
			spinner.edit({ embeds: [$1] });
		}, 600);
		setTimeout(() => {
			spinner.edit({ embeds: [$2] });
		}, 1200);
		setTimeout(() => {
			spinner.edit({ embeds: [$3] });
		}, 1800);

		if ($ === $$ && $ === $$$) {
			setTimeout(async () => {
				const moneyEarned = guild.slotsMoneyPool;
				user.wallet += moneyEarned;
				await user.save();

				guild.slotsMoneyPool = 0;
				guild.slotsWinMultiplier = 0;
				await guild.save();

				return message.channel.send(`CONGRATS! You won **$${moneyEarned}**`);
			}, 2000);
		} else {
			setTimeout(async () => {
				guild.slotsWinMultiplier++;
				guild.slotsMoneyPool += gambledAmount;
				await guild.save();
				return message.channel.send('Sorry, you lost your money!');
			}, 2000);
		}
		return;
	}
}
