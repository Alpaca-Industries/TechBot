import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchUser, fetchItemByName } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		const itemToBuy = await args.restResult('string');
		if (itemToBuy.success === false) return message.reply('Please specify a valid item');


		const item = await fetchItemByName(itemToBuy.value.replaceAll(' ', '_'));
		if (item === undefined) return message.reply('That item does not exist');

		const user = await fetchUser(message.author);

		if (user.wallet < item.price) return message.reply('You do not have enough money');

		user.wallet -= item.price;
		user.save();

		const inventory = await fetchInventory(message.author, item);

		inventory.amount++;
		inventory.save();

		return message.reply(`You bought ${item.name} for ${item.price.toLocaleString()}`);
	}
}
