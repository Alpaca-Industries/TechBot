import type { ClientOptions } from 'discord.js';
import type { ConnectionOptions } from 'typeorm';

import path from 'path';

import dotenv from 'dotenv';
// Switch between .env and .env.test depending on process.env.DEV
dotenv.config({ path: path.resolve(process.env.DEV ? '.env.test' : '.env') });
const typeORMConfig: ConnectionOptions = {
	type: process.env.DB_TYPE as 'better-sqlite3' | 'mariadb',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: true,
	entities: [path.join(__dirname + '/entities/**/*.{ts,js}'), path.join(__dirname + '/entities/*.{ts,js}')]
};

const sapphireConfig: ClientOptions = {
	loadMessageCommandListeners: true,
	intents: ['GUILDS', 'GUILD_INTEGRATIONS'],
	defaultCooldown: {
		delay: 5000
	}
};

export const config = {
	typeORMConfig,
	sapphireConfig,
	token: process.env.TOKEN,
	OWNERS: ['926690397269413938', '296042121297788931', '696368083517964288']
};
