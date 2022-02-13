import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export declare class ownerOnlyPrecondition extends Precondition {
	chatInputRun(
		interation: CommandInteraction
	): Promise<import('@sapphire/framework').Result<unknown, import('@sapphire/framework').UserError>>;
}
declare module '@sapphire/framework' {
	interface Preconditions {
		ownerOnly: never;
	}
}
//# sourceMappingURL=ownerOnly.d.ts.map
