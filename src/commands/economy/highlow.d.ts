import { CommandInteraction } from 'discord.js';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
export default class DailyCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=highlow.d.ts.map
