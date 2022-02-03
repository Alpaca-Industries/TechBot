import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

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
	public async catCommandLogic(): Promise<PepeBoy.CommandLogic> {
		const cat: Cat = await axios
			.get('https://api.thecatapi.com/v1/images/search')
			.then((res) => res.data[0]);

		if (isNil(cat)) return;

		return {
			ephemeral: false,
			embeds: [
				new MessageEmbed()
					.setColor('#7289DA')
					.setImage(cat.url)
					.setFooter({
						text: `Breed: ${cat[0].breeds[0].name} | life-span: ${cat[0].breeds[0].life_span} | Temperament: ${cat[0].breeds[0].temperament}`
					})
			]
		};
	}

	async messageRun(message: Message<boolean>, args: Args) {
		return message.channel.send(await this.catCommandLogic());
	}

	async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.catCommandLogic());
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
