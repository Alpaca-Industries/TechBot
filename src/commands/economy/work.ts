import { generateErrorEmbed } from './../../helpers/logging';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'work',
	description: 'Makes you slave away your final days on earth :)',
	detailedDescription: 'work'
})
export default class WorkCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await fetchUser(message.author);
		const workEmbed = new MessageEmbed();
		const job = user.currentJob;

		if (job === 'jobless') return message.reply({ embeds: [generateErrorEmbed("You don't have a job! Do `job select janitor` to get started!", 'No Job')] });

		let moneyEarned: number;

		switch (job) {
			case 'janitor':
				moneyEarned = 250;
				break;
			case 'chief':
				moneyEarned = 500;
				break;
			case 'fire_fighter':
				moneyEarned = 750;
				break;
			case 'pepe_king':
				moneyEarned = 1000;
				break;
		}

		user.wallet += moneyEarned;
		user.save();

		workEmbed.setTitle(`You worked as a ${job.toProperCase()}`).setDescription(`While working you earned **$${moneyEarned.toLocaleString()}**.`).setColor('BLUE');

		return message.channel.send({ embeds: [workEmbed] });
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const user = await fetchUser(interaction.user);
		const workEmbed = new MessageEmbed();
		const job = user.currentJob;

		if (job === 'jobless') return interaction.reply({ embeds: [generateErrorEmbed("You don't have a job! Do `job select janitor` to get started!", 'No Job')] });

		let moneyEarned: number;

		switch (job) {
			case 'janitor':
				moneyEarned = 250;
				break;
			case 'chief':
				moneyEarned = 500;
				break;
			case 'fire_fighter':
				moneyEarned = 750;
				break;
			case 'pepe_king':
				moneyEarned = 1000;
				break;
		}

		user.wallet += moneyEarned;
		user.save();

		workEmbed.setTitle(`You worked as a ${job.toProperCase()}`).setDescription(`While working you earned **$${moneyEarned.toLocaleString()}**.`).setColor('BLUE');

		return interaction.reply({ embeds: [workEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
