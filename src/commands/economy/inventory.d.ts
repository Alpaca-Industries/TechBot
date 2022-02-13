import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export default class InventoryCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=inventory.d.ts.map
