import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	aliases: ['with', 'withdrow'],
	detailedDescription: 'with <amount>'
})
export default class withdrawCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const amountToWithdraw = await args.pick('integer').catch(() => 1);
		if (amountToWithdraw < 0) return message.reply('Please specify a valid amount of money to withdraw');

		fetchUser(message.author).then((user) => {
			user.bank -= amountToWithdraw;
			user.wallet += amountToWithdraw;
			user.save();
		});

		return message.reply(`You withdrew ${amountToWithdraw.toLocaleString()} coins from your bank account`);
	}
}
