import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { Dog } from '../../types/animals';
import axios from 'axios';

@ApplyOptions<CommandOptions>({
	name: 'dog',
	description: 'Shows a cute dog image.',
	detailedDescription: 'dog'
})
export default class DogCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const dogEmbed = new MessageEmbed();
		const dog: Dog = await axios
			.get('https://api.thedogapi.com/v1/images/search')
			.then((res) => res.data[0]);

		dogEmbed.setImage(dog.url);

		if (dog.breeds !== null && dog.breeds !== undefined) {
			dogEmbed.setFooter({
				text: `Breed: ${dog.breeds[0].name} | life-span: ${dog.breeds[0].life_span} | Temperament: ${dog.breeds[0].temperament}`
			});
		}
		return interaction.reply({ embeds: [dogEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
}
