import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

const OWNERS = ['926690397269413938', '296042121297788931'];

export class ownerOnlyPrecondition extends Precondition {
	public async run(message: Message) {
		return OWNERS.includes(message.author.id) ? this.ok() : this.error({ message: 'This command can only be used by the owner.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ownerOnly: never;
	}
}
