import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchItemByName } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/logging';

@ApplyOptions<CommandOptions>({
	name: 'giveItem',
	aliases: ['give-item', 'shareItem', 'share-item'],
	description: 'Allows you to give items to another user.',
	detailedDescription: 'give-item <user> <item> <amount>'
})
export default class giveItemCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const userToGiveTo = await args.pickResult('user');
		const itemToGive = await args.restResult('string');
		const amount = await args.pick('integer').catch(() => 1);

		if (userToGiveTo.value.id === message.author.id) return message.channel.send({ embeds: [generateErrorEmbed('You cannot give money to yourself!')] });

		if (!userToGiveTo.success || userToGiveTo.value.bot) return message.channel.send({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (itemToGive.value === null) return message.channel.send({ embeds: [generateErrorEmbed('Invalid Item Specified!')] });
		if (amount < 0) return message.channel.send({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] }); // return message.reply('Please specify a valid amount of money to withdraw');
		// Senders Inventory
		fetchInventory(message.author, await fetchItemByName(itemToGive.value)).then((inventory) => {
			if (inventory === undefined) return message.reply('You do not have that item');
			if (inventory.amount < amount) return message.channel.send({ embeds: [generateErrorEmbed('You do not have that much of that item!')] });
			inventory.amount -= amount;
			inventory.save();
			return message;
		});
		// Recievers Inventory
		fetchInventory(userToGiveTo.value, await fetchItemByName(itemToGive.value)).then((inventory) => {
			inventory.amount += amount;
			inventory.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User gave item!').setDescription(`${message.author.tag} has given ${amount.toLocaleString()} ${itemToGive.value} to ${userToGiveTo.value.tag}.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You gave ${amount} ${itemToGive.value} to ${userToGiveTo.value.username}`);
	}
}
