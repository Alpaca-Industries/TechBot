import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Lets your deposit coins into your bank account',
})
export default class depositCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const amountToDeposit = await args.restResult('number');
		if (amountToDeposit.value < 0 && amountToDeposit.success === false) return message.reply('Please specify a valid amount of money to deposit');

		const user = await fetchUser(message.author);
		user.wallet -= amountToDeposit.value;
		user.bank += amountToDeposit.value;
		user.save();

		return message.reply(`You deposited ${amountToDeposit.value} coins into your bank account`);
	}
}