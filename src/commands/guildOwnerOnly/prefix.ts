import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'prefix',
	description: 'Allows you to change the prefix of the bot.',
	requiredUserPermissions: ['MANAGE_GUILD']
})
export default class prefixCommand extends Command {
	async messageRun(message: Message, args: Args) {
		const prefix = await args.pick('string').catch(() => '-');
		fetchGuild(message.guild).then((guild) => {
			guild.prefix = prefix;
			guild.save();
		});
		return message.reply(`Prefix changed to ${prefix}`);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const prefix = interaction.options.getString('prefix');
		fetchGuild(interaction.guild).then((guild) => {
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
