import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { findGuild } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'prefix',
	description: 'Allows you to change the prefix of the bot.',
	requiredUserPermissions: ['MANAGE_GUILD']
})
export default class prefixCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		const prefix = await args.pickResult('string');
		if (prefix.success === true) {
			const guild = findGuild(message.guild);
			guild.prefix = prefix.value;
			await guild.save();
			return message.channel.send(`Prefix changed to ${prefix.value}`);
		}
		return;
	}
}
