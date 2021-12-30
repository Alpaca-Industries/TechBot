import type { ClientOptions } from "discord.js";
import type{ ConnectionOptions } from "typeorm";

import path from "path";

const typeORMConfig: ConnectionOptions = {
	type: 'mariadb',
	host: 'alpacaindustries.com',
	port: 3306,
	username: 'economy',
	password: 'economy',
	database: 'economy',
	synchronize: true,
	logging: false,
	entities: [
		path.join(__dirname + '/entities/**/*.{ts,js}')
	]
}

const sapphireConfig: ClientOptions = {
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	defaultPrefix: '-'
}

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
