import { Precondition } from '@sapphire/framework';

const;

export class ownerOnlyPrecondition extends Precondition {
	public async chatInputRun(interation) {
		return OWNERS.includes(interation.user.id)
			? this.ok()
			: this.error({ message: 'This command can only be used by the owner.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ownerOnly: never;
	}
}
