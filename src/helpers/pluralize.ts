export function pluralize(text: string, num: number, suffix: string = 's') {
	const suf = num !== 1 ? suffix : '';
	return text + suf;
}
