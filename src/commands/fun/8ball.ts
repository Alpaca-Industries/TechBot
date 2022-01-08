import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: '8ball',
	description: 'RNG chooses your fate.',
	detailedDescription: '8ball <question>'
})
export class ChooseCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		let arg = await args.restResult('string');
		if (!arg.success) return message.reply("I can't predict nothing!");
		const optionsArray = ['Yes!', 'No!', 'Nope!', 'Go ask a friend.', 'It seems so.', 'For sure.', 'Maybe.', 'Of course!', 'Nah', 'Possibly', 'That seems correct.'];
		return message.channel.send(`:8ball: ${optionsArray[Math.floor(Math.random() * optionsArray.length)]}`);
	}
}
