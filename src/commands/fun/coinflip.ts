import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'coinflip',
	description: 'Flip a coin!'
})
export class PingCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
        if (Math.floor(Math.random() * 2) === 1) return message.reply("Heads")
        if (Math.floor(Math.random() * 2) === 1) return message.reply("Tails")        
	}
}