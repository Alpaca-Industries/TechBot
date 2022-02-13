import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export declare class PingCommand extends Command {
	chatInputRun(
		interaction: CommandInteraction
	): Promise<import('discord-api-types').APIMessage | import('discord.js').Message<boolean>>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=ping.d.ts.map
