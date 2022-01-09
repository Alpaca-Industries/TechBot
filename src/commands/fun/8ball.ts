import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: '8ball',
	description: 'RNG chooses your fate.',
	detailedDescription: '8ball <question>'
})
export class ChooseCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args): Promise<unknown> {
		let arg = await args.restResult('string');
		if (!arg.success) return message.reply("I can't predict nothing!");
		const optionsArray = ['Yes!', 'No!', 'Nope!', 'Go ask a friend.', 'It seems so.', 'For sure.', 'Maybe.', 'Of course!', 'Nah', 'Possibly', 'That seems correct.'];
		return message.channel.send(`:8ball: ${optionsArray[Math.floor(Math.random() * optionsArray.length)]}`);
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const optionsArray = ['Yes!', 'No!', 'Nope!', 'Go ask a friend.', 'It seems so.', 'For sure.', 'Maybe.', 'Of course!', 'Nah', 'Possibly', 'That seems correct.'];
		return interaction.reply(`:8ball: ${optionsArray[Math.floor(Math.random() * optionsArray.length)]}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'question',
					type: 'STRING',
					description: 'The question to ask.',
					required: true
				}
			]
		});
	}
}
