import type { Args, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { isNil } from 'lodash';
import { Dog } from '../../types/animals';
import axios from 'axios';

@ApplyOptions<CommandOptions>({
	name: 'dog',
	description: 'Shows a cute dog image.'
})
export default class DogCommand extends Command {
	async messageRun(
		message: Message<boolean>,
		args: Args,
		context: CommandContext
	): Promise<unknown> {
		const dogEmbed = new MessageEmbed();
		const dog: Dog[] = await axios.get(
			'https://api.thedogapi.com/v1/images/search'
		).then(res => res.data);

		dogEmbed.setImage(dog[0].url);

		if (!isNil(dog[0].breeds[0]))
			dogEmbed.setFooter(
				`Breed: ${dog[0].breeds[0].name} | life-span: ${dog[0].breeds[0].life_span} | Temperament: ${dog[0].breeds[0].temperament}`
			);

		return message.channel.send({ embeds: [dogEmbed] });
	}
}
