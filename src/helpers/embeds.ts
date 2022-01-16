import { ColorResolvable, MessageEmbed } from 'discord.js';

export const generateErrorEmbed = (error: string, errorType: string = '') => {
	const errType = errorType !== '' ? `: ${errorType}` : '';

	return new MessageEmbed()
		.setColor('#ED4245')
		.setTitle('Error' + errType)
		.setDescription(error);
};

export const generateEmbed = (description: string, title: string, color: ColorResolvable = 'BLUE') => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};
