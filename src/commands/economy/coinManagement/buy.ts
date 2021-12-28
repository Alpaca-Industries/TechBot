import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchUser, findItemByName } from '../../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.'
})
export default class BuyCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		const itemToBuy = await args.restResult('string');

		const item = await findItemByName(itemToBuy.value.replaceAll(' ', '_'));

		if (item === null) return message.reply('Please specify a valid item');

		const user = await fetchUser(message.author);

		if (user.wallet < item.price) return message.reply('You do not have enough money');

		user.wallet -= item.price;
		user.save();

		const inventory = await fetchInventory(message.author, item);

		inventory.amount += 1;
		inventory.save();

		return message.reply(`You bought ${item.name} for ${item.price}`);
	}
}
