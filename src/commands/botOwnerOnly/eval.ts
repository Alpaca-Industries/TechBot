import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { inspect } from 'util';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { VM } from 'vm2';
import { envParseArray } from '../../lib/env-parser';

const OWNERS = envParseArray('OWNERS');

@ApplyOptions<CommandOptions>({
	name: 'eval',
	description: '',
	// preconditions: ['ownerOnly'],
	flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
	options: ['depth'],
	detailedDescription: 'eval [code]'
})
export default class EvalCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const code = await args.rest('string');

		const { result, success, type } = await this.eval(message, code, {
			async: args.getFlags('async'),
			depth: Number(args.getOption('depth')) ?? 0,
			showHidden: args.getFlags('hidden', 'showHidden')
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;
		if (args.getFlags('silent', 's')) return null;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return message.reply({
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}

		return message.reply(`${output}\n${typeFooter}`);
	}

	private async eval(message: Message<boolean>, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;

		// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = message;

		let success = true;
		let result = null;

		try {
			// eslint-disable-next-line no-eval
			try {
				if (OWNERS.includes(message.author.id)) {
					result = inspect(eval(code), { depth: flags.depth, showHidden: flags.showHidden });
				} else {
					result = inspect(new VM({ timeout: 1000, sandbox: {} }).run(code), {
						depth: flags.depth,
						showHidden: flags.showHidden
					});
				}
			} catch (error) {}
		} catch (error) {
			if (error && error instanceof Error && error.stack) {
				this.container.client.logger.error(error);
			}
			result = error;
			success = false;
		}

		const type = new Type(result).toString();
		if (isThenable(result)) result = await result;

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return { result, success, type };
	}
}
