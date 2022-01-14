import type { ClientOptions } from 'discord.js';
import type { ConnectionOptions } from 'typeorm';

import path from 'path';
import { Guild } from './entities/guild';

const typeORMConfig: ConnectionOptions = {
	type: process.env.DEV ? 'better-sqlite3' : 'mariadb',
	host: process.env.DEV ? 'localhost' : 'alpacaindustries.com',
	port: 3306,
	username: 'economy',
	password: 'economy',
	database: 'economy',
	synchronize: true,
	logging: false,
	entities: [path.join(__dirname + '/entities/**/*.{ts,js}'), path.join(__dirname + '/entities/*.{ts,js}')]
};

const sapphireConfig: ClientOptions = {
	loadMessageCommandListeners: true,
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_INTEGRATIONS'],
	fetchPrefix: (message) => {
		return Guild.findOne({ where: { id: message.guild.id } }).then((guild) => {
			if (guild === undefined) return '-';
			return guild.prefix;
		});
	},
	typing: true
};

export const config = {
	typeORMConfig,
	sapphireConfig,
	token: 'NzcyNjMyNzk0OTI0ODQzMDM4.X59gXQ.j9mHMU15a23LSAwoTcSV_D58cIM'
};
