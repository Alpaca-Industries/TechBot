'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.fetchGuild = exports.fetchInventory = exports.fetchUser = exports.fetchItemByName = void 0;
const inventory_1 = require('../entities/economy/inventory');
const item_1 = require('../entities/economy/item');
const user_1 = require('../entities/economy/user');
const guild_1 = require('../entities/guild');
const isSafeInteger_1 = require('./isSafeInteger');
/*
const ItemRegistry = {
    'Fishing_Pole': 1,
    'Scissors': 2,
    'Hunting_Rifle': 3,
    'TV': 4,
    'Laptop': 5,
    'Grilled_Cheese': 6,
    'IPhone': 7,
    'Helicopter': 8,
    'Golden_Chicken_Nugget': 9
};
*/
const fetchItemByName = (name) => {
	const item = item_1.Item.findOne({ where: { name: name } });
	if (item === undefined) {
		throw new Error(`Item with name ${name} not found`);
	}
	return item;
};
exports.fetchItemByName = fetchItemByName;
const fetchUser = async (user) => {
	// Look for user if doesn't already exist make new one and return
	let userData = await user_1.User.findOne({ where: { id: user.id } });
	if (userData === undefined) {
		userData = new user_1.User();
		userData.id = user.id;
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	if (
		!(0, isSafeInteger_1.isSafeInteger)(userData.wallet) ||
		!(0, isSafeInteger_1.isSafeInteger)(userData.bank)
	) {
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	return userData;
};
exports.fetchUser = fetchUser;
const fetchInventory = async (user, item) => {
	const userData = await (0, exports.fetchUser)(user);
	let inventory = await inventory_1.Inventory.findOne({ where: { userId: userData.id, itemID: item.id } });
	if (inventory === undefined) {
		inventory = new inventory_1.Inventory();
		inventory.userId = user.id;
		inventory.itemID = item.id;
		inventory.amount = 0;
		await inventory.save();
	}
	return inventory;
};
exports.fetchInventory = fetchInventory;
const fetchGuild = async (guild) => {
	if (guild === undefined) {
		throw new Error('Guild is undefined');
	}
	let guildData = await guild_1.Guild.findOne({ where: { id: guild.id } });
	if (guildData === undefined) {
		guildData = new guild_1.Guild();
		guildData.id = guild.id;
		guildData.prefix = '-';
		guildData.slotsMoneyPool = 0;
		guildData.slotsWinMultiplier = 0;
		await guildData.save();
	}
	return guildData;
};
exports.fetchGuild = fetchGuild;
//# sourceMappingURL=dbHelper.js.map
