import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchItemByName } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'giveItem',
	aliases: ['give-item', 'shareItem', 'share-item'],
	description: 'Allows you to give items to another user.',
	detailedDescription: 'give-item <user> <item> <amount>'
})
export default class giveItemCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const userToGiveTo = await args.pickResult('user');
		const itemToGive = await args.restResult('string');
		const amount = await args.pick('integer').catch(() => 1);

		if (userToGiveTo.value.id === message.author.id) return message.reply('You cannot give money to yourself');

		if (!userToGiveTo.success || userToGiveTo.value.bot) return message.reply('Please specify a valid user');
		if (itemToGive.value === null) return message.reply('Please specify a valid item');
		if (amount < 0) return message.reply('Please specify a valid amount of money to withdraw');
		if (userToGiveTo.value.id === message.author.id) return message.reply('You cannot give money to yourself');
		const giverInventory = await fetchInventory(message.author, await fetchItemByName(itemToGive.value));
		const receiverInventory = await fetchInventory(userToGiveTo.value, await fetchItemByName(itemToGive.value));

		if (giverInventory === undefined) return message.reply('You do not have that item');
		if (giverInventory.amount < amount) return message.reply('You do not have that many of that item');

		receiverInventory.amount += amount;
		giverInventory.amount -= amount;

		if (giverInventory.amount === 0) giverInventory.remove();
		else giverInventory.save();

		receiverInventory.save();

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
		const embed = new MessageEmbed().setTitle('User gave item!').setDescription(`${message.author.tag} has given ${amount} ${itemToGive.value} to ${userToGiveTo.value.tag}.`).setColor('#00ff00').setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You gave ${amount} ${itemToGive.value} to ${userToGiveTo.value.username}`);
	}
}
