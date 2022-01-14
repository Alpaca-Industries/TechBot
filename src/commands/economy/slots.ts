import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

import { parseAmount } from '../../helpers/parseAmount';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild, fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'slots',
	description: 'Lets you gamble your money in a slot machine',
	detailedDescription: 'slots <amount>'
})
export default class SlotsCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await fetchUser(message.author);
		const { success: gambledAmountSuccess, value: gambledAmount } = parseAmount(await args.pickResult('string'), user, true);

		if (!gambledAmountSuccess || gambledAmount < 20) return message.channel.send('Please gamble a proper amount, a.k.a above 20');
		if (user.wallet < gambledAmount) return message.channel.send('You dont have enough money...');

		const guild = await fetchGuild(message.guild);

		const slotEmoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];

		const $ = items[Math.floor(items.length * Math.random())];
		const $$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;
		const $$$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;

		const play = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotEmoji + '  ' + slotEmoji + '  ' + slotEmoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });

		const $1 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${slotEmoji}   ${slotEmoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const $2 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${$$}   ${slotEmoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

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
		return null;
	}

	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const amount = parseAmount(interaction.options.getString('amount'), user, true);

		if (amount < 20) return interaction.reply('Please gamble a proper amount, a.k.a above 20');
		if (user.wallet < amount) return interaction.reply('You dont have enough money...');

		const guild = await fetchGuild(interaction.guild);

		const slotEmoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];

		const $ = items[Math.floor(items.length * Math.random())];
		const $$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;
		const $$$ = guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : $;

		const play = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotEmoji + '  ' + slotEmoji + '  ' + slotEmoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });

		const $1 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${slotEmoji}   ${slotEmoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const $2 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${$$}   ${slotEmoji} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		const $3 = new MessageEmbed().setTitle('Slot Machine').setDescription(`• ${$}   ${$$}   ${$$$} •`).setColor('RANDOM').setFooter({ text: 'Are you feeling lucky?' });

		interaction.reply({ embeds: [play] });
		setTimeout(() => {
			interaction.editReply({ embeds: [$1] });
		}, 600);
		setTimeout(() => {
			interaction.editReply({ embeds: [$2] });
		}, 1200);
		setTimeout(() => {
			interaction.editReply({ embeds: [$3] });
		}, 1800);

		if ($ === $$ && $ === $$$) {
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

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'amount',
					type: 'STRING',
					description: 'The amount to bet.',
					required: true
				}
			]
		});
	}
}
