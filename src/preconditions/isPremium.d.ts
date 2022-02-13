import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
export declare class isPremiumPrecondition extends Precondition {
	chatInputRun(
		interaction: CommandInteraction
	): Promise<import('@sapphire/framework').Result<unknown, import('@sapphire/framework').UserError>>;
}
declare module '@sapphire/framework' {
	interface Preconditions {
		isPremium: never;
	}
}
//# sourceMappingURL=isPremium.d.ts.map
