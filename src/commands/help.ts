import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Get help with the bot or a certain command.',
	detailedDescription: 'help [command]'
})
export default class helpCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const specifiedCommand = await args.pick('string').catch(() => '');
		// List All Commands Registered In Sapphire
		const commands = this.container.stores.get('commands');
		const categories = commands.categories;
		const paginatedMessage = new PaginatedMessage({ template: new MessageEmbed().setTitle('Help') });

		if (specifiedCommand.length > 0) {
			const command = commands.find((c) => c.name === specifiedCommand);
			if (command === undefined) return message.reply('That command does not exist!');

			paginatedMessage.addPageEmbed(new MessageEmbed().setTitle(`${command.name}`).setDescription(`${command.description}`).setColor('#20ce1f'));
		}

		for (const category of categories) {
			const fields: { name: string; value: any }[] = [];

			// Filter commands to categories and take intoacount sub categories
			const filteredCommands = commands.filter((c) => String(c.fullCategory) === category || String(c.fullCategory[c.fullCategory.length]) === category[category.length]);
			for (const [_, command] of filteredCommands) {
				fields.push({
					name: `${command.name}`,
					value: `\nDescription: ${command.description}\nUsage: ${command.detailedDescription}`
				});
			}

			paginatedMessage.addPageEmbed(new MessageEmbed().setTitle(category).setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n')));
		}

		return paginatedMessage.run(message, message.author);
	}
}
