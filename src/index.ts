// TypeORM Imports
import { Connection } from 'typeorm';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

// Discord.js Imports
import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;
if (Boolean(process.env.DEV)) console.log('Running in DEVELOPMENT mode.');
const startBot = async () => {
	client.login(config.token);
	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	connection = await createConnection(config.typeORMConfig);
};

declare global {
	interface String {
		toProperCase(): string;
		pluralize(): string;
	}
}

String.prototype.toProperCase = function () {
	return this.replaceAll('_', ' ').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

startBot();
