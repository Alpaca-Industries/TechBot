import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'rob',
	description: "Lets you rob another user's bank account."
})
export default class robCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const userToRob = await args.pickResult('user');

		if (!userToRob.success) return message.reply('You need to specify a user to rob!');

		if (message.author.id === userToRob.value.id) return message.reply('You cannot rob yourself!');

		fetchUser(userToRob.value).then((user) => {
			if (user.passiveMode) return message.reply('This user is in passive mode!');

			if (Math.random() > 0.6) return message.reply(`You failed to rob ${userToRob.value.username}!`);

			const amount = Math.floor(Math.random() * (user.bank * 0.25));

			message.reply(`You successfully robbed ${userToRob.value.username}! You got ${amount} coins!`);

			fetchUser(message.author).then((userTwo) => {
				if (userTwo.passiveMode) return message.reply('You are in passive mode');
				userTwo.wallet += amount;
				userTwo.save();
			});
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToRob = interaction.options.getUser('user');

		if (interaction.user.id === userToRob.id) return interaction.reply('You cannot rob yourself!');

		fetchUser(userToRob).then((user) => {
			if (user.passiveMode) return interaction.reply('This user is in passive mode!');

			if (Math.random() > 0.6) return interaction.reply(`You failed to rob ${userToRob.username}!`);

			const amount = Math.floor(Math.random() * (user.bank * 0.25));

			interaction.reply(`You successfully robbed ${userToRob.username}! You got ${amount} coins!`);

			fetchUser(interaction.user).then((userTwo) => {
				if (userTwo.passiveMode) return interaction.reply('You are in passive mode');
				userTwo.wallet += amount;
				userTwo.save();
			});
		});
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The user to rob.',
						required: true
					}
				]
			},
			{ idHints: ['931782008408002560'] }
		);
	}
}
