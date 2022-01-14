// TypeORM Imports
import { Connection } from 'typeorm';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

// Discord.js Imports
import { SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;
if (Boolean(process.env.DEV)) console.log('Running in DEVELOPMENT mode.');
const startBot = async () => {
	client.login(config.token);

	connection = await createConnection(config.typeORMConfig);
};

declare global {
	interface String {
		toProperCase(): string;
		pluralize(): string;
	}
}

String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

startBot();

/*
for (const job of Object.values(diffrentJobs)) {
	let newJob = new Jobs();

	newJob.name = job.name;
	newJob.description = job.description;
	newJob.minimumXP = job.requiredXP;

	newJob.save()
}
*/
