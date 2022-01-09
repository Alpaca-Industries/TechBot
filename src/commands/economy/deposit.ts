import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, WebhookClient } from 'discord.js';

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
		const amountToDeposit = await args.rest('string').then((value) => {
			return Number(value) || 'all';
		});
		if (amountToDeposit < 0) return message.reply('Please specify a valid amount of money to deposit');

		let walletBalance: number;
		fetchUser(message.author).then((user) => {
			walletBalance = user.wallet;
			user.wallet -= amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.bank += amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User Deposit').setDescription(`${message.author.tag} has deposited ${walletBalance.toLocaleString()} coins into their account.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You deposited ${walletBalance.toLocaleString()} coins into your bank account`);
	}
}
