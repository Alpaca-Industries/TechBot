import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { fetchInventory, fetchItemByName } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish for little fishies',
	detailedDescription: 'fish'
})
export class PingCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		// Define catchedFish as a 50/50 chance of being a fish or not
		const catchedFish = Math.random() < 0.5;
		if (!catchedFish) {
			return interaction.reply("You didn't catch anything.");
		}

		// Determine the amount of fish they caught
		const fishAmount = Math.floor(Math.random() * 10) + 1;

		await fetchInventory(interaction.user, await fetchItemByName('fish')).then(async (inventory) => {
			// Add the fish to their inventory
			inventory.amount += fishAmount;
			await inventory.save();
		});
		return interaction.reply(`You caught ${fishAmount} fish!`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
}
