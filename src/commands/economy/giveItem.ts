import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchItemByName } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'giveItem',
	aliases: ["give-item", "shareItem", "share-item"],
	description: 'Allows you to give items to another user.'
})
export default class giveItemCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const userToGiveTo = await args.pickResult('user');
		const itemToGive = await args.restResult('string');
		const amount = await args.restResult('integer');

		if (userToGiveTo.success === false) return message.reply('Please specify a valid user');
		if (itemToGive.value === null) return message.reply('Please specify a valid item');
		if (amount.value < 0 || amount.success === false) return message.reply('Please specify a valid amount of money to withdraw');
		if (userToGiveTo.value.id === message.author.id) return message.reply('You cannot give money to yourself');
		const giverInventory = await fetchInventory(message.author, await fetchItemByName(itemToGive.value));
		const receiverInventory = await fetchInventory(userToGiveTo.value, await fetchItemByName(itemToGive.value));

		if (giverInventory === undefined) return message.reply('You do not have that item');
		if (giverInventory.amount < amount.value) return message.reply('You do not have that many of that item');

		receiverInventory.amount += amount.value;
		giverInventory.amount -= amount.value;

		if (giverInventory.amount === 0) giverInventory.remove();
		else giverInventory.save();

		receiverInventory.save();

		return message.reply(`You gave ${amount.value} ${itemToGive.value} to ${userToGiveTo.value.username}`);
	}
}