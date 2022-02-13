import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild } from '../../helpers/dbHelper';
import { prefixCache } from '../../index';

@ApplyOptions<CommandOptions>({
	name: 'prefix',
	description: 'Allows you to change the prefix of the bot.',
	requiredUserPermissions: ['MANAGE_GUILD'],
	detailedDescription: 'prefix [new prefix]'
})
export default class prefixCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const prefix = interaction.options.getString('prefix');
		prefixCache.set(interaction.guild.id, { creationDate: new Date(), prefix });
		await fetchGuild(interaction.guild).then((guild) => {
			guild.prefix = prefix;
			guild.save();
		});
		return interaction.reply(`Prefix changed to ${prefix}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options.setName('prefix').setRequired(true).setDescription('The new prefix.')
				)
		);
	}
}
