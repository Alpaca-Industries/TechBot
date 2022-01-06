import { ApplyOptions } from '@sapphire/decorators';
import type { UserError, CommandDeniedPayload, ListenerOptions } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import dayjs from 'dayjs';

@ApplyOptions<ListenerOptions>({
	event: 'commandDenied'
})
export class CommandDeniedListener extends Listener {
	public run(error: UserError & { context?: { remaining?: number }; precondition?: { name?: string } }, { message }: CommandDeniedPayload) {
		if (error.precondition.name === 'Cooldown') {
			const timeInMS = Math.ceil(error.context.remaining / 1000);
			message.reply(`You can use this command again in ${dayjs(timeInMS, 'seconds').format('h [hours], m [minutes], s [seconds]')}`);
		} else {
			message.channel.send(error.message);
		}
	}
}
