import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pong!',
	detailedDescription: 'ping'
})
export class PingCommand extends Command {
	async messageRun(message: Message, args: Args) {
		const msg = await message.reply('Pinging...');
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			(msg.editedTimestamp || msg.createdTimestamp) -
			(message.editedTimestamp || message.createdTimestamp)
		}ms.`;
		return msg.edit(content);
	}

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
