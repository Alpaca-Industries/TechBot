import type { Args, CommandOptions } from '@sapphire/framework';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Message, MessageEmbed } from 'discord.js';
import { getPrefix } from '../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Get help with the bot or a certain command.',
	detailedDescription: 'help [command]'
})
export default class helpCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const specifiedCommand = await args.pick('string').catch(() => '');
		const prefix = await getPrefix(message.guild);
		// List All Commands Registered In Sapphire
		const commands = this.container.stores.get('commands');

		if (specifiedCommand.length > 0) {
			const command = commands.find(
				(c) =>
					c.name === specifiedCommand.toLowerCase() ||
					c.name.startsWith(specifiedCommand.toLowerCase())
			);
			if (!command) return message.reply('That command does not exist!');

			const singleCommandResponse = new MessageEmbed()
				.setTitle(`${command.detailedDescription}`)
				.setDescription(`${command.description}`)
				.setColor('BLUE');

			return message.channel.send({ embeds: [singleCommandResponse] });
		}

		const categories = commands.categories;
		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed()
				.setTitle('Help')
				.setColor('BLUE')
				.setFooter({ text: `This server's prefix is ${prefix}` })
		});

		for (const category of categories) {
			const fields: { name: string; value: any }[] = [];

			// Filter commands to categories and take intoacount sub categories
			const filteredCommands = commands.filter(
				(c) =>
					String(c.fullCategory) === category ||
					String(c.fullCategory[c.fullCategory.length]) === category[category.length]
			);
			for (const [_, command] of filteredCommands) {
				fields.push({
					name: command.name,
					value: command.description
				});
			}

			paginatedMessage.addPageEmbed(
				new MessageEmbed()
					.setTitle(category.toProperCase())
					.setColor('BLUE')
					.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
					.setFooter({ text: `This server's prefix is ${prefix}` })
			);
		}

		return paginatedMessage.run(message, message.author);
	}
}
