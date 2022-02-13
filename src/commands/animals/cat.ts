import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { Cat } from '../../types/animals';
import axios from 'axios';

@ApplyOptions<CommandOptions>({
	name: 'cat',
	description: 'Shows a cute cat image.',
	detailedDescription: 'cat'
})
export default class CatCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const catEmbed = new MessageEmbed();
		const cat: Cat = await axios
			.get('https://api.thecatapi.com/v1/images/search')
			.then((res) => res.data[0]);

		catEmbed.setImage(cat.url).setTitle('Cat').setURL(cat.url).setColor('BLUE');

		if (cat.breeds !== null && cat.breeds !== undefined) {
			catEmbed.setDescription(
				`Breed: ${cat.breeds[0].name}\nLife Span: ${cat.breeds[0].life_span}\nTemperament: ${cat.breeds[0].temperament}`
			);
		}

		return interaction.reply({ embeds: [catEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
}
