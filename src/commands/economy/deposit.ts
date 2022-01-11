import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, WebhookClient } from 'discord.js';

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
	async messageRun(message: Message<boolean>, args: Args) {
		const amountToDeposit = await args.rest('string').then((value) => {
			return Number(value) || 'all';
		});
		if (amountToDeposit < 0) return message.reply('Please specify a valid amount of money to deposit');

		let walletBalance: number;
		await fetchUser(message.author).then((user) => {
			walletBalance = user.wallet;
			user.wallet -= amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.bank += amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		webhook.send({
			embeds: [
				{
					title: 'User Deposit',
					description: `${message.author.tag} has deposited ${walletBalance.toLocaleString()} coins into their account.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});

		return message.reply(`You deposited ${walletBalance.toLocaleString()} coins into your bank account`);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const amountToDeposit = Number(interaction.options.getString('amount')) || 'all';
		if (amountToDeposit < 0) return interaction.reply('Please specify a valid amount of money to deposit');

		let walletBalance: number;
		await fetchUser(interaction.user).then((user) => {
			user.wallet -= amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.bank += amountToDeposit === 'all' ? walletBalance : amountToDeposit;
			user.save();
			walletBalance = user.wallet;
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		webhook.send({
			embeds: [
				{
					title: 'User Deposit',
					description: `${interaction.user.tag} has deposited ${walletBalance.toLocaleString()} coins into their account.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});

		return interaction.reply(`You deposited ${walletBalance.toLocaleString()} coins into your bank account`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'amount',
					type: 'STRING',
					description: 'the amount of money to deposit.',
					required: true
				}
			]
		});
	}
}
