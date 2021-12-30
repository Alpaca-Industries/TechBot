// TypeORM Imports
import type { Connection } from 'typeorm';
import "reflect-metadata";
import { createConnection } from 'typeorm';

// Discord.js Imports
import { SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';

// Moment
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment as any);

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'], defaultPrefix: '-' });

export let connection: Connection;

const startBot = async () => {
	client.login(config.token).then(() => {
		client.logger.info('Bot is now running!');
	});

	connection = await createConnection(config.typeORMConfig);
}

startBot();