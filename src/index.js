'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.prefixCache = exports.connection = void 0;
// TypeORM Imports
const typeorm_1 = require('typeorm');
require('reflect-metadata');
// Discord.js Imports
const framework_1 = require('@sapphire/framework');
// Global Imports
const config_1 = require('./config');
const client = new framework_1.SapphireClient(config_1.config.sapphireConfig);
exports.prefixCache = new Map();
if (Boolean(process.env.DEV)) console.log('Running in DEVELOPMENT mode.');
String.prototype.toProperCase = function () {
	return this.replaceAll('_', ' ').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
(async () => {
	await client.login(config_1.config.token);
	framework_1.ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical('OVERWRITE' /* Overwrite */);
	exports.connection = await (0, typeorm_1.createConnection)(config_1.config.typeORMConfig);
})();
// Every 10 minutes, delete all prefixes that have been unused for more than 30 minutes.
setInterval(() => {
	exports.prefixCache.forEach((value, key) => {
		if (value.creationDate.getTime() + 1800000 < Date.now()) {
			exports.prefixCache.delete(key);
		}
	});
}, 600000);
//# sourceMappingURL=index.js.map
