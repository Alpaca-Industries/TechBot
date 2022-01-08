export const owoify = (text: string) => {
	const faces = ['(*^ω^)', '(◕‿◕✿)', '(◕ᴥ◕)', 'ʕ•ᴥ•ʔ', 'ʕ￫ᴥ￩ʔ', '(*^.^*)', 'owo', '(｡♥‿♥｡)', 'uwu', '(*￣з￣)', '>w<', '^w^', '(つ✧ω✧)つ', '(/ =ω=)/'];

	return text
		.replace(/[lr]/g, 'w')
		.replace(/[LR]/g, 'W')
		.replace(/n([aeiou])/g, 'ny$1')
		.replace(/N([aeiou])/g, 'Ny$1')
		.replace(/N([AEIOU])/g, 'Ny$1')
		.replace(/ove/g, 'uv')
		.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		.replace(/!+/g, `! ${faces[Math.floor(Math.random() * faces.length)]}`);
};
