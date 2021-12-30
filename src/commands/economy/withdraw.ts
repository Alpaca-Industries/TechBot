import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Lets your withdraw coins into your bank account'
})
export default class withdrawCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const amountToWithdraw = await args.restResult('number');
		if (amountToWithdraw.value < 0 && amountToWithdraw.success === false) return message.reply('Please specify a valid amount of money to withdraw');

		const user = await fetchUser(message.author);
		user.bank -= amountToWithdraw.value;
		user.wallet += amountToWithdraw.value;
		user.save();

		return message.reply(`You withdrew ${amountToWithdraw.value} coins from your bank account`);
	}
}