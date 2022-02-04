import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'prefix',
	description: 'Allows you to change the prefix of the bot.',
	requiredUserPermissions: ['MANAGE_GUILD'],
	detailedDescription: 'prefix [new prefix]'
})
export default class prefixCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const prefix = interaction.options.getString('prefix');
		await fetchGuild(interaction.guild).then((guild) => {
			guild.prefix = prefix;
			guild.save();
		});
		return interaction.reply(`Prefix changed to ${prefix}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'prefix',
					type: 'STRING',
					description: 'The new prefix.',
					required: true
				}
			]
		});
	}
}
