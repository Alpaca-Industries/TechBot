import path from "path";
import type{ ConnectionOptions } from "typeorm";

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

export const config = {
	economyDefaults: {
		items: [],
		wallet: 0,
		bank: 0
	},
	token: 'NzcyNjMyNzk0OTI0ODQzMDM4.X59gXQ.j9mHMU15a23LSAwoTcSV_D58cIM',
	typeORMConfig
};
