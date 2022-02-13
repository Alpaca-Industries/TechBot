'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const decorators_1 = require('@sapphire/decorators');
const util_1 = require('util');
const type_1 = require('@sapphire/type');
const utilities_1 = require('@sapphire/utilities');
const plugin_editable_commands_1 = require('@sapphire/plugin-editable-commands');
const vm2_1 = require('vm2');
const config_1 = require('../../config');
let evalCommand = class evalCommand extends framework_1.Command {
	async messageRun(message, args) {
		const code = await args.rest('string');
		const { result, success, type } = await this.eval(message, code, {
			async: args.getFlags('async'),
			depth: Number(args.getOption('depth')) ?? 0,
			showHidden: args.getFlags('hidden', 'showHidden')
		});
		const output = success
			? (0, utilities_1.codeBlock)('js', result)
			: `**ERROR**: ${(0, utilities_1.codeBlock)('bash', result)}`;
		if (args.getFlags('silent', 's')) return null;
		const typeFooter = `**Type**: ${(0, utilities_1.codeBlock)('typescript', type)}`;
		if (output.length > 2000) {
			return (0, plugin_editable_commands_1.send)(message, {
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}
		return (0, plugin_editable_commands_1.send)(message, `${output}\n${typeFooter}`);
	}
	async eval(message, code, flags) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;
		// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = message;
		let success = true;
		let result = null;
		try {
			// eslint-disable-next-line no-eval
			try {
				if (config_1.config.OWNERS.includes(message.author.id)) {
					result = (0, util_1.inspect)(eval(code), {
						depth: flags.depth,
						showHidden: flags.showHidden
					});
				} else {
					result = (0, util_1.inspect)(new vm2_1.VM({ timeout: 1000, sandbox: {} }).run(code), {
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
		const type = new type_1.Type(result).toString();
		if ((0, utilities_1.isThenable)(result)) result = await result;
		if (typeof result !== 'string') {
			result = (0, util_1.inspect)(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}
		return { result, success, type };
	}
};
evalCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'eval',
			description: '',
			// preconditions: ['ownerOnly'],
			flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
			options: ['depth'],
			detailedDescription: 'eval [code]'
		})
	],
	evalCommand
);
exports.default = evalCommand;
//# sourceMappingURL=eval.js.map
