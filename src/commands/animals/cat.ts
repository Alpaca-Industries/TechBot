import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { isNil } from 'lodash';
import { Cat } from '../../types/animals';
import axios from 'axios';

@ApplyOptions<CommandOptions>({
	name: 'cat',
	description: 'Shows a cute cat image.',
	detailedDescription: 'cat'
})
export default class CatCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const catEmbed = new MessageEmbed();
		const cat: Cat[] = await axios
			.get('https://api.thecatapi.com/v1/images/search')
			.then((res) => res.data);

		catEmbed.setImage(cat[0].url);

		if (!isNil(cat[0].breeds[0]))
			catEmbed.setFooter({
				text: `Breed: ${cat[0].breeds[0].name} | life-span: ${cat[0].breeds[0].life_span} | Temperament: ${cat[0].breeds[0].temperament}`
			});

		return interaction.reply({ embeds: [catEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
