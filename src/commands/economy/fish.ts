import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';

import { CommandInteraction, Message, User } from 'discord.js';
import { Item } from '../../entities/economy/item';
import { fetchInventory, fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class StatsCommand extends Command {
	private async fishLogic(user: User) {
		const userdetails = await fetchUser(user);

		if (
			userdetails.inventory.filter(
				async (item) => item.itemID === (await Item.findOne({ where: { name: 'fishing_pole' } })).id
			)[0].amount === 0
		)
			return 'You do not have a fishing pole!';
		const fishing_success = Math.random() ? true : false;

		if (fishing_success) {
			const fish = await Item.findOne({ where: { name: 'fish' } });
			fetchInventory(user, fish).then(async (inventory) => {
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);
				inventory.amount += fish_amount;
				inventory.save();
			});
			return `You caught a ${fish.name}!`;
		} else return 'You failed to catch anything!';
	}
	async messageRun(message: Message, args: Args) {
		return message.reply(await this.fishLogic(message.author));
	}

	async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.fishLogic(interaction.user));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description
			},
			{ idHints: ['936045296968949800'] }
		);
	}
}
