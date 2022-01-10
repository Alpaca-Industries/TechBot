export const clean = (text: string) => {
	return text.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>');
};
