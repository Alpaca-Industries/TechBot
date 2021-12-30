import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
})
export default class giveMoneyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const userToGiveTo = await args.pick('user');
		const amountToGive = await args.restResult('integer');

		if (userToGiveTo === null) return message.reply('Please specify a valid user');
		if (amountToGive.value < 0 || amountToGive.success === false) return message.reply('Please specify a valid amount of money to withdraw');
		if (userToGiveTo.id === message.author.id) return message.reply('You cannot give money to yourself');

		const giver = await fetchUser(message.author);
		const receiver = await fetchUser(userToGiveTo);

		if (giver.wallet < amountToGive.value) return message.reply('You do not have that much money');

		giver.wallet -= amountToGive.value;
		receiver.wallet += amountToGive.value;

		giver.save();
		receiver.save();

		return message.reply(`You gave ${amountToGive.value.toLocaleString()} coins to ${userToGiveTo.username}`);
	}
}