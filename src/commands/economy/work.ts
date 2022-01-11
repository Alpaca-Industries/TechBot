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
		const workEmbed = new MessageEmbed();
		const jobs = ['Financial Advisor', 'Paralegal', 'Mason', 'Zoologist', 'Truck Driver', 'Painter', 'Compliance Officer', 'Actor', 'Veterinarian', 'Chemist', 'Architect', 'Software Developer', 'Massage Therapist', 'Dancer', 'Receptionist', 'Historian', 'Drafter', 'Medical Assistant', 'Childcare worker', 'Epidemiologist'];
		const moneyEarned = Math.round(Math.random() * (600 - jobs.length) + (jobs.length - 10));
		const job = jobs[Math.floor(Math.random() * jobs.length)];

		fetchUser(message.author).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		workEmbed.setTitle(`You worked as a ${job}`).setDescription(`💰While working you earned $${moneyEarned.toLocaleString()}💰`).setColor('BLUE');

		return message.channel.send({ embeds: [workEmbed] });
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const workEmbed = new MessageEmbed();
		const jobs = ['Financial Advisor', 'Paralegal', 'Mason', 'Zoologist', 'Truck Driver', 'Painter', 'Compliance Officer', 'Actor', 'Veterinarian', 'Chemist', 'Architect', 'Software Developer', 'Massage Therapist', 'Dancer', 'Receptionist', 'Historian', 'Drafter', 'Medical Assistant', 'Childcare worker', 'Epidemiologist'];
		const moneyEarned = Math.round(Math.random() * (600 - jobs.length) + (jobs.length - 10));
		const job = jobs[Math.floor(Math.random() * jobs.length)];

		fetchUser(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		workEmbed.setTitle(`You worked as a ${job}`).setDescription(`💰While working you earned $${moneyEarned.toLocaleString()}💰`).setColor('BLUE');

		return interaction.reply({ embeds: [workEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
