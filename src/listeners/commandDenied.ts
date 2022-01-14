import { MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { UserError, ListenerOptions } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import dayjs from 'dayjs';

@ApplyOptions<ListenerOptions>({
	event: 'messageCommandDenied'
})
export class CommandDeniedListener extends Listener {
	public run(
		error: UserError & { context?: { remaining?: number }; precondition?: { name?: string } },
		{ message }
	) {
		if (error.precondition.name === 'Cooldown') {
			const timeInMS = Math.ceil(error.context.remaining / 1000);
			message.reply(
				`You can use this command again in ${dayjs(timeInMS, 'seconds').format(
					'h [hours], m [minutes], s [seconds]'
				)}`
			);
		} else {
			const response = new MessageEmbed()
				.setTitle('Error')
				.setDescription(error.message)
				.setColor('#ED4245');

			message.channel.send({ embeds: [response] });
		}
	}
}
