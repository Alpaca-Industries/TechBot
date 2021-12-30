import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'ban',
	description: ''
})
export default class banCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args, context: CommandContext): Promise<unknown> {
		// Check if user has ban permission
		if (message.member.permissions.has('BAN_MEMBERS') === false) {
			return message.channel.send('You do not have permission to ban members.');
		}
		const punishedUser = await args.pickResult('member');
		const reason = await args.restResult('string');

		let banReason = reason.value || 'No reason specified.';

		if (punishedUser.success === false) {
			return message.channel.send('You must specify a user to ban.');
		}

		if (punishedUser.value.id === message.author.id) {
			return message.channel.send('You cannot ban yourself.');
		}

		if (punishedUser.value.bannable === false || punishedUser.value.roles.hoist.position >= message.member.roles.hoist.position) {
			return message.channel.send('You cannot ban this user.');
		}



		await punishedUser.value.ban({ reason: banReason });
		return message.channel.send(`${punishedUser.value.displayName} has been banned.`);
	}
}