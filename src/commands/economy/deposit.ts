import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Lets your deposit coins into your bank account',
	aliases: ['dep', 'depos'],
	detailedDescription: 'deposit <amount>'
})
export default class depositCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const amountToDeposit = await args.restResult('number');
		if (amountToDeposit.value < 0 || !amountToDeposit.success) return message.reply('Please specify a valid amount of money to deposit');

		fetchUser(message.author).then((user) => {
			user.wallet -= amountToDeposit.value;
			user.bank += amountToDeposit.value;
			user.save();
		});

		return message.reply(`You deposited ${amountToDeposit.value.toLocaleString()} coins into your bank account`);
	}
}
