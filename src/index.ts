// TypeORM Imports
import { Connection } from 'typeorm';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

// Discord.js Imports
import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';

// Global Imports
import { config } from './config';
import { Item } from './entities/economy/item';
import { Jobs } from './entities/economy/jobs';

const client = new SapphireClient(config.sapphireConfig);

export let connection: Connection;
if (Boolean(process.env.DEV)) console.log('Running in DEVELOPMENT mode.');

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

const startBot = async () => {
	client.login(config.token);
	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	connection = await createConnection(config.typeORMConfig);

	const differentJobs = [
		{
			name: 'Janitor',
			description: 'Mop the floor, clean the toilets.',
			requiredXP: 0
		},
		{
			name: 'Chief',
			description: 'Cook, clean, eat.',
			requiredXP: 300
		},
		{
			name: 'Fire Fighter',
			description: 'Fight fires, make bank.',
			requiredXP: 450
		},
		{
			name: 'YouTuber',
			description: 'Rank in money from the ads.',
			requiredXP: 590
		},
		{
			name: 'Investor',
			description: 'Invest in companies.',
			requiredXP: 800
		},
		{
			name: 'Pepe King',
			description: 'You wish you were this.',
			requiredXP: 1024
		}
	];

	for (const job of differentJobs) {
		let newJob = new Jobs();

		newJob.name = job.name;
		newJob.description = job.description;
		newJob.minimumXP = job.requiredXP;

		await newJob.save();
	}

	connection.getRepository(Item).manager.query(`
    INSERT INTO economy.item (price,rarity,emoji,description,name,sellable,tradeable,collectable) VALUES
     (800,'common',':fishing_pole_and_fish:','I was forgotten about by the devs ;(.','Fishing_Pole',0,0,0),
     (500,'common',':scissors:','I was forgotten about by the devs ;(.','Scissors',0,0,0),
     (5000,'rare',':tv:','I was forgotten about by the devs ;(.','TV',0,0,0),
     (2500,'rare',':laptop:','I was forgotten about by the devs ;(.','Laptop',0,0,0),
     (50000,'epic',':pizza:','I was forgotten about by the devs ;(.','Grilled_Cheese',0,0,0),
     (10000,'common','<:rifle:927072788085346334>','I was forgotten about by the devs ;(.','Hunting_Rifle',0,0,0),
     (1500,'rare',':mobile_phone:','I was forgotten about by the devs ;(.','IPhone',0,0,0),
     (25000,'epic',':helicopter:','I was forgotten about by the devs ;(.','Helicopter',0,0,0),
     (10000,'epic',':chicken:','I was forgotten about by the devs ;(.','Golden_Chicken_Nugget',0,0,0);`);
};

startBot();
