import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'rps',
	description: 'Lets you play RPS with the bot!',
	detailedDescription: `rps <choice>`
})
export default class rpsCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const choice = await args.pick('string').catch(() => '');

		if (choice === '') return message.reply('You need to specify a choice!');

		const userChoice = ['rock', 'paper', 'scissors'];
		const userChoiceIndex = userChoice.indexOf(choice);
		if (userChoiceIndex === -1)
			return message.reply(
				'You need to specify a valid choice! Valid choices are rock, paper, scissors.'
			);
		const botChoice = userChoice[Math.floor(Math.random() * userChoice.length)];
		const botChoiceIndex = userChoice.indexOf(botChoice);

		if (userChoiceIndex === botChoiceIndex)
			return message.reply('You and the bot both chose the same thing! Try again!');

		if (userChoiceIndex === 0 && botChoiceIndex === 1)
			return message.reply('You chose rock, and the bot chose paper! You lose!');
		if (userChoiceIndex === 0 && botChoiceIndex === 2)
			return message.reply('You chose rock, and the bot chose scissors! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 0)
			return message.reply('You chose paper, and the bot chose rock! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 2)
			return message.reply('You chose paper, and the bot chose scissors! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 0)
			return message.reply('You chose scissors, and the bot chose rock! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 1)
			return message.reply('You chose scissors, and the bot chose paper! You win!');

		return message.reply('Something went wrong!');
	}

	async chatInputRun(interaction: CommandInteraction) {
		const choice = interaction.options.getString('choice', true);

		if (choice === '') return interaction.reply('You need to specify a choice!');

		const userChoice = ['rock', 'paper', 'scissors'];
		const userChoiceIndex = userChoice.indexOf(choice);
		if (userChoiceIndex === -1)
			return interaction.reply(
				'You need to specify a valid choice! Valid choices are rock, paper, scissors.'
			);
		const botChoice = userChoice[Math.floor(Math.random() * userChoice.length)];
		const botChoiceIndex = userChoice.indexOf(botChoice);

		if (userChoiceIndex === botChoiceIndex)
			return interaction.reply('You and the bot both chose the same thing! Try again!');

		if (userChoiceIndex === 0 && botChoiceIndex === 1)
			return interaction.reply('You chose rock, and the bot chose paper! You lose!');
		if (userChoiceIndex === 0 && botChoiceIndex === 2)
			return interaction.reply('You chose rock, and the bot chose scissors! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 0)
			return interaction.reply('You chose paper, and the bot chose rock! You win!');
		if (userChoiceIndex === 1 && botChoiceIndex === 2)
			return interaction.reply('You chose paper, and the bot chose scissors! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 0)
			return interaction.reply('You chose scissors, and the bot chose rock! You lose!');
		if (userChoiceIndex === 2 && botChoiceIndex === 1)
			return interaction.reply('You chose scissors, and the bot chose paper! You win!');

		return interaction.reply('Something went wrong!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'choice',
						type: 'STRING',
						description: 'This should be either "Rock", "Paper", or "Scissors".',
						required: true,
						autocomplete: true
					}
				]
			},
			{ idHints: ['933521388562702427'] }
		);
	}
}
