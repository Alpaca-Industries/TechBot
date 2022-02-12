import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';

import { CommandInteraction } from 'discord.js';
import { Item } from '../../entities/economy/item';
import { fetchInventory } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class StatsCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const doesUserHaveFishingPole = await fetchInventory(
			interaction.user,
			await Item.findOne({ where: { name: 'fishing_pole' } })
		);

		if (doesUserHaveFishingPole.amount === 0) return interaction.reply('You do not have a fishing pole!');
		const fishing_success = !!Math.random();

		if (fishing_success) {
			const fish = await Item.findOne({ where: { name: 'fish' } });
			fetchInventory(interaction.user, fish).then(async (inventory) => {
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);
				inventory.amount += fish_amount;
				await inventory.save();
			});
			return interaction.reply(`You caught a ${fish.name}!`);
		} else return interaction.reply('You failed to catch anything!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
}
