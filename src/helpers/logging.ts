import { MessageEmbed } from 'discord.js';

export const generateErrorEmbed = (error: string, errorType: string = '') => {
	const errType = errorType !== '' ? `: ${errorType}` : '';

	return new MessageEmbed()
		.setColor('#ED4245')
		.setTitle('Error' + errType)
		.setDescription(error);
};
