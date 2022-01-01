import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export const sendError = (message: Message, title: string, description: string) => {
	const errorEmbed = new MessageEmbed().setTitle(`Error: ${title}`).setDescription(description).setColor('RED');
	message.channel.send({ embeds: [errorEmbed] });
};
