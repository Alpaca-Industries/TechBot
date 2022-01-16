import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { replacer } from '../../helpers/replacer';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'clapify',
	aliases: ['clapfy'],
	description: 'Clapify your text.',
	detailedDescription: 'clapify <text>'
})
export default class clapifyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const text = await args.rest('string');
		const user = await fetchUser(message.author);
		const emoji = await replacer(
			user.preferredEmojiColor,
			{
				default: '👏',
				pale: '👏🏻',
				cream_white: '👏🏼',
				brown: '👏🏽',
				dark_brown: '👏🏾',
				black: '👏🏿'
			},
			'g'
		);

		return message.reply(text.replace(/\s+/g, ` ${emoji} `));
	}
}
