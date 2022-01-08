import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'reverse',
	description: 'Reverse your text.',
	detailedDescription: 'reverse <string>'
})
export class ReverseCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const arg = await args.rest('string').catch(() => 'spen! fuck wanna I');
		return message.channel.send(arg.split(' ').reverse().join(' '));
	}
}
