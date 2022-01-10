import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { clean } from '../../helpers/clean';

@ApplyOptions<CommandOptions>({
	name: 'choose',
	description: 'Chooses a argument from a string randomly.',
	detailedDescription: 'choose <string>, ...'
})
export class ChooseCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args): Promise<unknown> {
		let arg = await args.restResult('string');
		if (!arg.success) return message.reply('Please specify a string to choose options from!');
		const splitArg = arg.value.split(', ');
		return message.channel.send(clean(splitArg[Math.floor(Math.random() * splitArg.length)]));
	}

	async chatInputRun(interaction: CommandInteraction) {
		let arg = interaction.options.getString('choices', true);
		const splitArg = arg.split(', ');
		return interaction.reply(clean(splitArg[Math.floor(Math.random() * splitArg.length)]));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'choices',
					type: 'STRING',
					description: 'The choices seperated by ", "',
					required: true
				}
			]
		});
	}
}
