declare global {
	interface String {
		toProperCase(): string;
	}

	namespace NodeJS {
		interface ProcessEnv {
			DEV: boolean;
		}
	}
}

// TypeORM Imports
import { Connection } from 'typeorm';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import './types/types';

// Discord.js Imports
import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;
if (Boolean(process.env.DEV)) console.log('Running in DEVELOPMENT mode.');

String.prototype.toProperCase = function () {
	return this.replaceAll('_', ' ').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const startBot = async () => {
	client.login(config.token);
	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	connection = await createConnection(config.typeORMConfig);
};

startBot();
