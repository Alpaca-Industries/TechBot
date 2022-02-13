'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.owoify = void 0;
const clean_1 = require('./clean');
const owoify = (text) => {
	const faces = [
		'(*^ω^)',
		'(◕‿◕✿)',
		'(◕ᴥ◕)',
		'ʕ•ᴥ•ʔ',
		'ʕ￫ᴥ￩ʔ',
		'(*^.^*)',
		'owo',
		'(｡♥‿♥｡)',
		'uwu',
		'(*￣з￣)',
		'>w<',
		'^w^',
		'(つ✧ω✧)つ',
		'(/ =ω=)/'
	];
	return (0, clean_1.clean)(
		text
			.replace(/[lr]/g, 'w')
			.replace(/[LR]/g, 'W')
			.replace(/n([aeiou])/g, 'ny$1')
			.replace(/N([aeiou])/g, 'Ny$1')
			.replace(/N([AEIOU])/g, 'Ny$1')
			.replace(/ove/g, 'uv')
			.replace(/!+/g, `! ${faces[Math.floor(Math.random() * faces.length)]}`)
	);
};
exports.owoify = owoify;
//# sourceMappingURL=stringManipulation.js.map
