import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
export default class ShopCommand extends Command {
	chatInputRun(interaction: CommandInteraction): Promise<void>;
	registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=shop.d.ts.map
