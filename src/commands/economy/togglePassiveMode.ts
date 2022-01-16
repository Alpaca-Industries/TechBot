import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'passiveModeToggle',
	description: 'Lets you disable/enable the ability to be robbed',
	detailedDescription: 'passivemodetoggle <bool>'
})
export default class togglePassiveModeCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const newValue = await args.pick('boolean').catch(() => undefined);

		if (newValue === undefined) return message.reply('You need to specify a boolean!');

		fetchUser(message.author).then((user) => {
			user.passiveMode = newValue;
			user.save();
		});

		return message.reply(`Your passive mode has been set to **${newValue}**!`);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const newValue = interaction.options.getBoolean('new_mode');

		if (newValue === null) return interaction.reply('You need to specify a boolean!');

		fetchUser(interaction.user).then((user) => {
			user.passiveMode = newValue;
			user.save();
		});

		return interaction.reply(`Your passive mode has been set to **${newValue}**!`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'new_mode',
						type: 'BOOLEAN',
						description: 'The new value for passive mode.',
						required: true
					}
				]
			},
			{ idHints: ['931788800848433212'] }
		);
	}
}