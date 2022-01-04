import { MessageEmbed } from 'discord.js';

export const generateErrorEmbed = (error: string) => {
	return new MessageEmbed().setColor('#ff0000').setTitle('Error').setDescription(error);
};
