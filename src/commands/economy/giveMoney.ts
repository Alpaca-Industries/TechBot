import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class giveMoneyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const userToGiveTo = await args.pickResult('user');
		const amountToGive = await args.pick('integer').catch(() => 1);

		if (!userToGiveTo.success || userToGiveTo.value.bot) return message.reply('Please specify a valid user');
		if (amountToGive < 0) return message.reply('Please specify a valid amount of money to withdraw');
		if (userToGiveTo.value.id === message.author.id) return message.reply('You cannot give money to yourself');

		const giver = await fetchUser(message.author);
		const receiver = await fetchUser(userToGiveTo.value);

		if (giver.wallet < amountToGive) return message.reply('You do not have that much money');

		giver.wallet -= amountToGive;
		receiver.wallet += amountToGive;

		giver.save();
		receiver.save();

		return message.reply(`You gave ${amountToGive.toLocaleString()} coins to ${userToGiveTo.value.username}`);
	}
}
