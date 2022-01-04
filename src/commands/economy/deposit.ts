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
		const amountToDeposit = await args.restResult('number');
		if (amountToDeposit.value < 0 || !amountToDeposit.success) return message.reply('Please specify a valid amount of money to deposit');

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User Deposit').setDescription(`${message.author.tag} has deposited ${amountToDeposit.value} coins into their account.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		fetchUser(message.author).then((user) => {
			user.wallet -= amountToDeposit.value;
			user.bank += amountToDeposit.value;
			user.save();
		});

		return message.reply(`You deposited ${amountToDeposit.value.toLocaleString()} coins into your bank account`);
	}
}
