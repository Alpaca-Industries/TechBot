// import { MessageEmbed } from 'discord.js';
import type { ChatInputCommandDeniedPayload, UserError } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { generateErrorEmbed } from '../helpers/embeds';

export class CommandDeniedListener extends Listener {
	private humanizeTime(duration: number): string {
		const portions: string[] = [];

		const msInHour = 1000 * 60 * 60;
		const hours = Math.trunc(duration / msInHour);
		if (hours > 0) {
			portions.push(hours + 'h');
			duration = duration - hours * msInHour;
		}

		const msInMinute = 1000 * 60;
		const minutes = Math.trunc(duration / msInMinute);
		if (minutes > 0) {
			portions.push(minutes + 'm');
			duration = duration - minutes * msInMinute;
		}

		const seconds = Math.trunc(duration / 1000);
		if (seconds > 0) {
			portions.push(seconds + 's');
		}

		return portions.join(' ');
	}
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		if (error.identifier === 'preconditionCooldown') {
			const { remaining } = error.context as { remaining: number };

			const cooldownEmbed = generateErrorEmbed(
				`You can only use this command every ${this.humanizeTime(remaining)}`,
				error.identifier
			);

			return interaction.reply({ embeds: [cooldownEmbed] });
		}

		const errorEmbed = generateErrorEmbed(error.message, error.identifier);
		return interaction.reply({ embeds: [errorEmbed] });
	}
}
