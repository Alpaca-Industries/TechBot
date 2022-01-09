import { Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

export default class extends Command {
	constructor(context: Command.Context) {
		super(context, {
			description: 'Literally just says owo.'
		});
	}

	public chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('OwO');
	}
}
