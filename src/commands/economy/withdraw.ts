import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/logging';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	aliases: ['with', 'withdrow'],
	detailedDescription: 'with <amount>'
})
export default class withdrawCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const amountToWithdraw = await args.rest('string').then((value) => {
			return Number(value) || 'all';
		});
		if (amountToWithdraw < 0) return message.channel.send({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] });

		let walletBalance: number;
		fetchUser(message.author).then((user) => {
			walletBalance = user.wallet;
			user.wallet += amountToWithdraw === 'all' ? walletBalance : amountToWithdraw;
			user.bank -= amountToWithdraw === 'all' ? walletBalance : amountToWithdraw;
			user.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User 927773203349246003').setDescription(`${message.author.tag} has withdrawn ${walletBalance.toLocaleString()} coins into their account.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You withdrew ${amountToWithdraw.toLocaleString()} coins from your bank account`);
	}
}
