import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
export default class evalCommand extends Command {
	messageRun(message: Message<boolean>, args: Args): Promise<Message<boolean> | null>;
	private eval;
}
//# sourceMappingURL=eval.d.ts.map
