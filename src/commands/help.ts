import type { CommandOptions } from '@sapphire/framework';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getPrefix } from '../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Get help with the bot or a certain command.',
	detailedDescription: 'help [command]'
})
export default class helpCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const specifiedCommand = interaction.options.getString('specific_command', false) ?? '';
		const prefix = await getPrefix(interaction.guild);
		// List All Commands Registered In Sapphire
		const commands = this.container.stores.get('commands');

		if (specifiedCommand.length > 0) {
			const command = commands.find(
				(c) =>
					c.name === specifiedCommand.toLowerCase() ||
					c.name.startsWith(specifiedCommand.toLowerCase())
			);
			if (!command) return interaction.reply('That command does not exist!');

			const singleCommandResponse = new MessageEmbed()
				.setTitle(`${command.detailedDescription}`)
				.setDescription(`${command.description}`)
				.setColor('BLUE');

			return interaction.reply({ embeds: [singleCommandResponse] });
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

			// Filter commands to categories and take into account sub categories
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

		return paginatedMessage.run(interaction, interaction.user);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('specific_command').setDescription('The command to get help for.')
				)
		);
	}
}
