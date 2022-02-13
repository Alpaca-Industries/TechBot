import { ChatInputCommandDeniedPayload, Listener, UserError } from '@sapphire/framework';
export declare class CommandDeniedListener extends Listener {
	run(error: UserError, { interaction }: ChatInputCommandDeniedPayload): Promise<void>;
	private humanizeTime;
}
//# sourceMappingURL=chatInputCommandDenied.d.ts.map
