import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { isNil } from 'lodash';
import { Dog } from '../../types/animals';
import axios from 'axios';

@ApplyOptions<CommandOptions>({
	name: 'dog',
	description: 'Shows a cute dog image.',
	detailedDescription: 'dog'
})
export default class DogCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const dogEmbed = new MessageEmbed();
		const dog: Dog[] = await axios
			.get('https://api.thedogapi.com/v1/images/search')
			.then((res) => res.data);

		dogEmbed.setImage(dog[0].url);

		if (!isNil(dog[0].breeds[0]))
			dogEmbed.setFooter({
				text: `Breed: ${dog[0].breeds[0].name} | life-span: ${dog[0].breeds[0].life_span} | Temperament: ${dog[0].breeds[0].temperament}`
			});

		return interaction.reply({ embeds: [dogEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
