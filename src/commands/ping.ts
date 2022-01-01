import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pong!',
	detailedDescription: 'ping'
})
export class PingCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const msg = await message.channel.send('Pinging...');
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms.`;

		return msg.edit(content);
	}
}
