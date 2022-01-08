import type { ClientOptions } from 'discord.js';
import type { ConnectionOptions } from 'typeorm';

import path from 'path';
import { Guild } from './entities/guild';

const typeORMConfig: ConnectionOptions = {
	type: process.env.DEVELOMENT ? 'better-sqlite3' : 'mariadb',
	host: process.env.DEVELOMENT ? 'localhost' : 'alpacaindustries.com',
	port: 3306,
	username: 'economy',
	password: 'economy',
	database: 'economy',
	synchronize: true,
	logging: false,
	entities: [path.join(__dirname + '/entities/**/*.{ts,js}')]
};

const sapphireConfig: ClientOptions = {
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	fetchPrefix: (message) => {
		return Guild.findOne({ where: { id: message.guild.id } }).then((guild) => {
			if (guild === undefined) return '-';
			return guild.prefix;
		});
	}
};

export const config = {
	economyDefaults: {
		items: [],
		wallet: 0,
		bank: 0
	},
	typeORMConfig,
	sapphireConfig,
	token: 'NzcyNjMyNzk0OTI0ODQzMDM4.X59gXQ.j9mHMU15a23LSAwoTcSV_D58cIM'
};
