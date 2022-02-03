import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

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
	public async dogCommandLogic(): Promise<PepeBoy.CommandLogic> {
		const dog: Dog = await axios
			.get('https://api.thedogapi.com/v1/images/search')
			.then((res) => res.data[0]);

		if (isNil(dog)) return;

		return {
			ephemeral: false,
			embeds: [
				new MessageEmbed()
					.setColor('#7289DA')
					.setImage(dog.url)
					.setFooter({
						text: `Breed: ${dog[0].breeds[0].name} | life-span: ${dog[0].breeds[0].life_span} | Temperament: ${dog[0].breeds[0].temperament}`
					})
			]
		};
	}

	async messageRun(message: Message<boolean>, args: Args) {
		return message.channel.send(await this.dogCommandLogic());
	}

	async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.dogCommandLogic());
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
