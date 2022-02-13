import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export default class prefixCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=prefix.d.ts.map
