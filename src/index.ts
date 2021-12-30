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

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;

const startBot = async () => {
	client.login(config.token);

	connection = await createConnection(config.typeORMConfig);
}

startBot();