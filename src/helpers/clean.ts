import { config } from '../config';
export const clean = (text: string): string => {
	const result: string = text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
		.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>')
		.replaceAll(config.token, '');
	return result;
};
