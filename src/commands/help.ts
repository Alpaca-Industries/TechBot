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
		// List All Commands Registered In Sapphire
		const commands = this.container.stores.get('commands');
		const categories = commands.categories;
		const paginatedMessage = new PaginatedMessage({ template: new MessageEmbed().setTitle('Help') });
		/*
		const embed = new MessageEmbed();
		for (const command of commands) {
			const { name, description, fullCategory } = command;
			console.log(fullCategory);
			embed.addField(name || 'No name', description || 'No Description', true);
		}
		*/

		for (const category of categories) {
			const fields: { name: string; value: any }[] = [];
			/*
			commands.filter(c => String(c.fullCategory) === category || String(c.fullCategory[c.fullCategory.length]) === category[category.length]).forEach(command => {
                fields.push({
                    name: `${command.name}`,
                    value: command.detailedDescription || command.description
                });
            });
			*/

			// Filter commands to categories and take intoacount sub categories
			const filteredCommands = commands.filter(c => String(c.fullCategory) === category || String(c.fullCategory[c.fullCategory.length]) === category[category.length]);
			for (const [_, command] of filteredCommands) {
				fields.push({
					name: `${command.name}`,
					value: command.detailedDescription || command.description
				});
			}

			paginatedMessage.addPageEmbed(new MessageEmbed().setTitle(category).setDescription(fields.map(f => `${f.name}: ${f.value}`).join('\n')));
		}

		return await paginatedMessage.run(message, message.author);
	}
}