import { config } from '../config';
export const clean = (text: string): string => {
	const result: string = text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		.replaceAll(config.token, '');
	return result;
};
