export const pluralize = (text: string, num: number, suffix: string = 's'): string => {
	return text + (num !== 1 ? suffix : '');
};
