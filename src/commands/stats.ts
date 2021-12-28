import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import { stripIndents } from 'common-tags';
import { Message, version } from 'discord.js';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

@ApplyOptions<CommandOptions>({
	name: 'stats',
	description: 'Shows some stats about the bot'
})
export class StatsCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		momentDurationFormatSetup(moment as any);

		const duration = moment
			.duration(this.container.client.uptime)
			.format(' D [days], H [hrs], m [mins], s [secs]');

		const string = `
			= STATISTICS =
			• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
			• Uptime     :: ${duration}
			• Users      :: ${this.container.client.users.cache.size.toLocaleString()}
			• Servers    :: ${this.container.client.guilds.cache.size.toLocaleString()}
			• Channels   :: ${this.container.client.channels.cache.size.toLocaleString()}
			• Discord.js :: v${version}
			• Node       :: ${process.version}`;
		return message.channel.send({
			content: `\`\`\`asciidoc\n${stripIndents(string)}\`\`\``
		});
	}
}
