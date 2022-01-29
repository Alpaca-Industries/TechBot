import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';

import { CommandInteraction, Message, User } from 'discord.js';
import { Item } from '../../entities/economy/item';
import { fetchInventory } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class StatsCommand extends Command {
	private async fishLogic(user: User): Promise<PepeBoy.CommandLogic> {
		const doesUserHaveFishingPole = await fetchInventory(
			user,
			await Item.findOne({ where: { name: 'fishing_pole' } })
		);

		if (doesUserHaveFishingPole.amount === 0)
			return { embeds: [], ephemeral: true, content: 'You do not have a fishing pole!' };
		const fishing_success = Math.random() > 0.5;

		if (fishing_success) {
			const fish = await Item.findOne({ where: { name: 'fish' } });
			fetchInventory(user, fish).then(async (inventory) => {
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);
				inventory.amount += fish_amount;
				await inventory.save();
			});
			return {
				embeds: [],
				ephemeral: false,
				content: `You caught a ${fish.name}!`
			};
		} else return { embeds: [], ephemeral: false, content: 'You failed to catch anything!' };
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
