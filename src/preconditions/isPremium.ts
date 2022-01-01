import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { fetchUser } from '../helpers/dbHelper';

export class isPremiumPrecondition extends Precondition {
	public async run(message: Message) {
		return (await fetchUser(message.author)).premium ? this.ok() : this.error({ message: 'You need to be a premium user to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		premiunOnly: never;
	}
}
