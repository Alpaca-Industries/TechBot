import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { CommandInteraction } from 'discord.js';
export default class helpCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void | PaginatedMessage>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=help.d.ts.map
