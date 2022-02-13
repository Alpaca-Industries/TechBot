declare global {
	interface String {
		toProperCase(): string;
	}

	namespace NodeJS {
		interface ProcessEnv {
			readonly DEV: string | undefined;
		}
	}
}

// TypeORM Imports
import { Connection, createConnection } from 'typeorm';
import 'reflect-metadata';

// Discord.js Imports
import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;
export const prefixCache = new Map<string, { creationDate: Date; prefix: string }>();

if (process.env.DEV) console.log('Running in DEVELOPMENT mode.');

String.prototype.toProperCase = function () {
	return this.replaceAll('_', ' ').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

(async () => {
	await client.login(config.token);
	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	connection = await createConnection(config.typeORMConfig);
})();

// Every 10 minutes, delete all prefixes that have been unused for more than 30 minutes.
setInterval(() => {
	prefixCache.forEach((value, key) => {
		if (value.creationDate.getTime() + 1800000 < Date.now()) {
			prefixCache.delete(key);
		}
	});
}, 600000);
