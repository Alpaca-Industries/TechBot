import type { UserError, CommandDeniedPayload } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';

export class CommandDeniedListener extends Listener {
  public run(error: UserError & { context: { remaining?: number } }, { message }: CommandDeniedPayload) {
    if (error.name == "Cooldown") {   
        message.channel.send(`You must wait <t:${parseInt((new Date(error.context.remaining).getTime() / 1000).toFixed(0))}:f> (${parseInt((new Date(error.context.remaining).getTime() / 1000).toFixed(0))}:R>) before using that command again.`);
    } else {
        message.channel.send(error.message);
    }
  }
}

