export const replacer = (string: string, object: object, regexFlag: string = ''): string => {
	for (const [key, value] of Object.entries(object)) {
		let reg = new RegExp(key, regexFlag);
		string = string.replace(reg, value);
	}
	return string;
};
