import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'rps',
	description: 'Lets you play RPS with the bot!',
	detailedDescription: `rps <choice>`
})
export default class rpsCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args): Promise<unknown> {
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
}
