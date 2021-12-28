import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'balance',
	aliases: ['bal', 'money', 'balance', 'cash'],
	description: 'Returns a user\'s current balance.'
})
export default class BalanceCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		const balanceEmbed = new MessageEmbed();
		const user = (await args.pickResult('user')).value || message.author;

		const balance = await fetchUser(user);

		balanceEmbed
			.setAuthor(`${message.author.username}, This is your balance!`)
			.addField('Wallet: ', balance.wallet.toString())
			.addField('Bank: ', balance.bank.toString())
			.setColor('#20ce1f');

		return message.channel.send({ embeds: [balanceEmbed] });
	}
}
