import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'howgay',
	description: 'How gay are you?',
	detailedDescription: 'howgay [user]'
})
export class HowGayCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
        const user = (await args.pickResult('user')).value || message.author;
        if (user.id == "296042121297788931") return message.channel.send('Greysilly is sussy wussy uwu')
        return message.channel.send(`${user.tag} is **${Math.floor(Math.random() * 110)}%** gay!`)
	}
}