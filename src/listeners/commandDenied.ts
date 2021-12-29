import type { UserError, CommandDeniedPayload } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';

export class CommandDeniedListener extends Listener {
  public run(error: UserError & { context: { remaining?: number } }, { message }: CommandDeniedPayload) {
    if (error.name == "Cooldown") {   
        message.channel.send(`You must wait <t:${parseInt(error.context.remaining / 1000)}:f> (<t:${parseInt(error.context.remaining / 1000)}:R>) before using that command again.`);
    } else {
        message.channel.send(error.message);
    }
  }
}