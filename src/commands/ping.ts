import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pong!',
	detailedDescription: 'ping'
})
export class PingCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply('Pinging...');
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			Date.now() - interaction.createdTimestamp
		}ms.`;

		return interaction.editReply(content);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
