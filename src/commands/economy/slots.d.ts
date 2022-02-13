import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export default class SlotsCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void | null>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=slots.d.ts.map
