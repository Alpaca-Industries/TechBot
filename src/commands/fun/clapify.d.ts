import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export default class clapifyCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=clapify.d.ts.map
