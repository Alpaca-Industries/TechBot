import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

import { parseAmount } from '../../helpers/parseAmount';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild, fetchUser } from '../../helpers/dbHelper';
import { User } from '../../entities/economy/user';
import { Guild } from '../../entities/guild';

@ApplyOptions<CommandOptions>({
	name: 'slots',
	description: 'Lets you gamble your money in a slot machine',
	detailedDescription: 'slots <amount>'
})
export default class SlotsCommand extends Command {
	private async slotCommandLogic(
		user: User,
		guild: Guild,
		amount: number,
		message
	): Promise<PepeBoy.CommandLogic> {
		if (amount < 20) return { ephemeral: true, content: 'Please gamble a proper amount, a.k.a above 20' };
		if (user.wallet < amount) return { ephemeral: true, content: 'You dont have enough money...' };

		const slotEmoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];

		const firstRoll = items[Math.floor(items.length * Math.random())];
		const secondRoll =
			guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : firstRoll;
		const thirdRoll =
			guild.slotsWinMultiplier < 10 ? items[Math.floor(items.length * Math.random())] : firstRoll;

		const play = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotEmoji + '  ' + slotEmoji + '  ' + slotEmoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });

		const firstRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${slotEmoji}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		const secondRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		const thirdRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${thirdRoll} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		const spinner = await message.reply({ embeds: [play] });
		await setTimeout(() => {
			spinner.edit({ embeds: [firstRollEmbed] });
		}, 600);
		await setTimeout(() => {
			spinner.edit({ embeds: [secondRollEmbed] });
		}, 1200);
		await setTimeout(() => {
			spinner.edit({ embeds: [thirdRollEmbed] });
		}, 1800);

		if (firstRoll === secondRoll && firstRoll === thirdRoll) {
			setTimeout(async () => {
				const moneyEarned = guild.slotsMoneyPool;
				user.wallet += moneyEarned;
				await user.save();

				guild.slotsMoneyPool = 0;
				guild.slotsWinMultiplier = 0;
				await guild.save();
				return { ephemeral: false, content: `CONGRATS! You won **$${moneyEarned}**` };
			}, 2000);
		} else {
			setTimeout(async () => {
				guild.slotsWinMultiplier++;
				guild.slotsMoneyPool += amount;
				await guild.save();
				return { ephemeral: false, content: 'Sorry, you lost your money!' };
			}, 2000);
		}
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await fetchUser(message.author);
		const guild = await fetchGuild(message.guild);
		const amount = parseAmount(await args.pick('string').catch(() => ''), user, true);

		this.slotCommandLogic(user, guild, amount, message).then((res) => {
			return message.reply(res);
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const guild = await fetchGuild(interaction.guild);
		const amount = parseAmount(interaction.options.getString('amount'), user, true);

		this.slotCommandLogic(user, guild, amount, interaction).then((res) => {
			return interaction.reply(res);
		});
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
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
			},
			{ idHints: ['930278953950806026'] }
		);
	}
}
