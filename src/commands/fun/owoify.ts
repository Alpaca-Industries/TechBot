import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'owofy',
	description: 'Only for the true owoers.',
	detailedDescription: 'owo <string>'
})
export class OwOCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const arg = await args.rest('string').catch(() => 'Provide text to OwOfy.');
		const emoticonOptions = [':3', ':V', 'ʕ •ᴥ•ʔ', ':d'];
		return message.channel.send(
			arg
				.replace(/(l|r)/gi, 'w')
				.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
				.trim() + ` OwO ${emoticonOptions[Math.floor(Math.random() * emoticonOptions.length)]}`
		);
	}
}
