import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'beg',
	description: 'Begs people for cash.',
	detailedDescription: 'beg'
})
export default class BegCommand extends Command {
	messageRun(message: Message<boolean>, args: Args, context: CommandContext): unknown {
		if (Math.random() > 0.5) return message.channel.send('Random Man: Your pathetic poor person');
		const BegEmbed = new MessageEmbed();

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

		return message.channel.send({ embeds: [BegEmbed] });
	}
}
