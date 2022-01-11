import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/logging';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class giveMoneyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const reciever = await args.pickResult('user');
		const amount = await args.pick('integer').catch(() => 1);

		if (!reciever.success || reciever.value.bot || reciever.value.id === message.author.id) return message.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (amount < 0) return message.reply({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] });

		// Senders Inventory
		fetchUser(message.author).then((user) => {
			if (user.wallet < amount) return message.reply({ embeds: [generateErrorEmbed('You do not have that much money!')] });

			user.wallet -= amount;
			user.save();
			return null;
		});
		// Recievers Inventory
		fetchUser(reciever.value).then((user) => {
			user.wallet += amount;
			user.save();
			return null;
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User gave money!').setDescription(`${message.author.tag} has given ${amount.toLocaleString()} to ${reciever.value.tag}.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You gave ${amount.toLocaleString()} coins to ${reciever.value.username}`);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const reciever = interaction.options.getUser('user');
		const amount = interaction.options.getInteger('amount');

		if (reciever.bot || reciever.id === interaction.user.id) return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (amount < 0) return interaction.reply({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] });

		// Senders Inventory
		fetchUser(interaction.user).then((user) => {
			if (user.wallet < amount) return interaction.reply({ embeds: [generateErrorEmbed('You do not have that much money!')] });

			user.wallet -= amount;
			user.save();
			return null;
		});
		// Recievers Inventory
		fetchUser(reciever).then((user) => {
			user.wallet += amount;
			user.save();
			return null;
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User gave money!').setDescription(`${interaction.user.tag} has given ${amount.toLocaleString()} to ${reciever.tag}.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return interaction.reply(`You gave ${amount.toLocaleString()} coins to ${reciever.username}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'the user to transfer stuff to.',
					required: true
				},
				{
					name: 'amount',
					type: 'INTEGER',
					description: 'the amount of money to transfer.',
					required: true
				},
				{
					name: 'item',
					type: 'STRING',
					description: 'the item to transfer.',
					required: true
				}
			]
		});
	}
}
