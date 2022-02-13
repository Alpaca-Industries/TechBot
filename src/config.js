'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.config = void 0;
const tslib_1 = require('tslib');
const path_1 = (0, tslib_1.__importDefault)(require('path'));
const typeORMConfig = {
	type: process.env.DEV ? 'better-sqlite3' : 'mariadb',
	host: process.env.DEV ? 'localhost' : 'alpacaindustries.com',
	port: 3306,
	username: 'economy',
	password: 'economy',
	database: 'economy',
	synchronize: true,
	entities: [
		path_1.default.join(__dirname + '/entities/**/*.{ts,js}'),
		path_1.default.join(__dirname + '/entities/*.{ts,js}')
	]
};
const sapphireConfig = {
	loadMessageCommandListeners: true,
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_INTEGRATIONS'],
	defaultCooldown: {
		delay: 5000
	}
};
exports.config = {
	typeORMConfig,
	sapphireConfig,
	token: process.env.DEV
		? 'NzcyNjMyNzk0OTI0ODQzMDM4.X59gXQ.j9mHMU15a23LSAwoTcSV_D58cIM'
		: 'NzMzMTExMTQ3MzI2MjEwMDg4.Xw-Y9g.fM4pP65n3-HFC2q5KNj5GotaTEA',
	OWNERS: ['926690397269413938', '296042121297788931', '696368083517964288']
};
//# sourceMappingURL=config.js.map
