import { Precondition } from '@sapphire/framework';
import { fetchUser } from '../helpers/dbHelper';

export class isPremiumPrecondition extends Precondition {
	public async chatInputRun(interaction) {
		return (await fetchUser(interaction.author)).premium
			? this.ok()
			: this.error({ message: 'You need to be a premium user to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		isPremium: never;
	}
}
