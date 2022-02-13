'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const discord_js_utilities_1 = require('@sapphire/discord.js-utilities');
const discord_js_1 = require('discord.js');
let helpCommand = class helpCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const specifiedCommand = interaction.options.getString('specific_command', false) ?? '';
		// List All Commands Registered In Sapphire
		const commands = this.container.stores.get('commands');
		if (specifiedCommand.length > 0) {
			const command = commands.find(
				(c) =>
					c.name === specifiedCommand.toLowerCase() ||
					c.name.startsWith(specifiedCommand.toLowerCase())
			);
			if (!command) return interaction.reply('That command does not exist!');
			const singleCommandResponse = new discord_js_1.MessageEmbed()
				.setTitle(`${command.detailedDescription}`)
				.setDescription(`${command.description}`)
				.setColor('BLUE');
			return interaction.reply({ embeds: [singleCommandResponse] });
		}
		const categories = commands.categories;
		const paginatedMessage = new discord_js_utilities_1.PaginatedMessage({
			template: new discord_js_1.MessageEmbed().setTitle('Help').setColor('BLUE')
			// .setFooter({ text: `This server's prefix is ${prefix}` })
		});
		for (const category of categories) {
			const fields = [];
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
				new discord_js_1.MessageEmbed()
					.setTitle(category.toProperCase())
					.setColor('BLUE')
					.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
				// .setFooter({ text: `This server's prefix is ${prefix}` })
			);
		}
		return paginatedMessage.run(interaction, interaction.user);
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('specific_command').setDescription('The command to get help for.')
				)
		);
	}
};
helpCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'help',
			description: 'Get help with the bot or a certain command.',
			detailedDescription: 'help [command]'
		})
	],
	helpCommand
);
exports.default = helpCommand;
//# sourceMappingURL=help.js.map
