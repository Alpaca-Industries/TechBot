import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'clapify',
	description: ''
})
export default class clapifyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const textToClapify = await args
			.rest('string')
			.catch(() => '')
			.then((text) => text.replace(/\s+/g, '👏'));

		return message.reply(textToClapify);
	}
}
