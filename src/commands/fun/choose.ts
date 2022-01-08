import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'choose',
	description: 'Chooses a argument from a string randomly.',
	detailedDescription: 'choose <string>, ...'
})
export class ChooseCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		let arg = await args.restResult('string');
		if (!arg.success) return message.reply('Please specify a string to choose options from!');
		const splitArg = arg.value.split(', ');
		return message.channel.send(splitArg[Math.floor(Math.random() * splitArg.length)]);
	}
}
