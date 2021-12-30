import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'unban',
	description: ''
})
export default class unbanCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		// Check if user has ability to unban users
		if (message.member.permissions.has('BAN_MEMBERS') === false) {
			return message.channel.send('You do not have permission to unban members.');
		}

		const unpunishedUser = await args.pickResult('user');
		const reason = (await args.restResult('string')).value || 'No reason specified.';

		// Unban the user
		if (unpunishedUser.success === false) {
			return message.channel.send('You must specify a user to unban.');
		}

		if (unpunishedUser.value.id === message.author.id) {
			return message.channel.send('You cannot unban yourself.');
		}

		await message.guild.bans.remove(unpunishedUser.value.id, reason);
		return message.channel.send(`${unpunishedUser.value.tag} has been unbanned.`);
	}
}