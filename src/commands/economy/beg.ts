import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

const people = [
	'Alistair Douglas',
	'Franco Wilkerson',
	'Imaan Foreman',
	'Shazia Santana',
	'Zena Hodson',
	'Floyd Martins',
	'Solomon Webb',
	'Jamel Klein',
	'Raife Fields',
	'Ahsan Mora',
	'Arnie Stewart',
	'Aminah Mcclure',
	'Miranda Giles',
	'Elin Abbott',
	'Caitlin Michael',
	'Alice Espinosa',
	'Waqar Howe',
	'Tristan Leblanc',
	'Cadence Kane',
	'Reanne Lewis',
	'Oisin Hoover',
	'Roisin Bean',
	'Jak Ventura',
	'Bryony Power',
	'Saba Hartley'
];

const failedBegResponses = [
	'Your pathetic poor person.',
	'Go beg someone else!',
	'Back in the old days, we had to work for our money.'
];

@ApplyOptions<CommandOptions>({
	name: 'beg',
	description: 'Begs people for cash.',
	detailedDescription: 'beg'
})
export default class BegCommand extends Command {
	messageRun(message: Message<boolean>, args: Args) {
		const failedBegEmbed = new MessageEmbed()
			.setAuthor({ name: people[Math.floor(people.length * Math.random())] })
			.setDescription(failedBegResponses[Math.floor(failedBegResponses.length * Math.random())])
			.setColor('RED');

		if (Math.random() > 0.5) return message.reply({ embeds: [failedBegEmbed] });

		const BegEmbed = new MessageEmbed();

		const moneyEarned = Math.round(
			// people.length is the minimum amount and 600 is the maximum amount
			Math.random() * (600 - people.length) + (people.length - 1)
		);

		fetchUser(message.author).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		BegEmbed.setTitle(`You begged ${people[Math.floor(Math.random() * people.length)]} for money`)
			.setDescription(`💰While begging you earned $${moneyEarned.toLocaleString()}💰`)
			.setColor('BLUE');

		return message.reply({ embeds: [BegEmbed] });
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const failedBegEmbed = new MessageEmbed()
			.setAuthor({ name: people[Math.floor(people.length * Math.random())] })
			.setDescription(failedBegResponses[Math.floor(failedBegResponses.length * Math.random())])
			.setColor('RED');

		if (Math.random() > 0.5) return interaction.reply({ embeds: [failedBegEmbed] });

		const BegEmbed = new MessageEmbed();

		const moneyEarned = Math.round(
			// people.length is the minimum amount and 600 is the maximum amount
			Math.random() * (600 - people.length) + (people.length - 1)
		);

		fetchUser(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		BegEmbed.setTitle(`You begged ${people[Math.floor(Math.random() * people.length)]} for money`)
			.setDescription(`💰While begging you earned $${moneyEarned.toLocaleString()}💰`)
			.setColor('BLUE');

		return interaction.reply({ embeds: [BegEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
