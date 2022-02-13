import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
export default class messageListener extends Listener {
	run(message: Message<boolean>): Promise<Message<boolean> | undefined>;
}
//# sourceMappingURL=message.d.ts.map
