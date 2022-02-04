import { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { Inventory } from '../entities/economy/inventory';
import { Item } from '../entities/economy/item';
import { User as EconomyUser } from '../entities/economy/user';
import { Guild as DBGuild } from '../entities/guild';
import { isSafeInteger } from './isSafeInteger';

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

export const fetchItemByName = (name: string): Promise<Item> => {
	return Item.findOne({ where: { name: name } });
};

export const fetchUser = async (user: DiscordUser): Promise<EconomyUser> => {
	// Look for user if not exist make new one and return
	let userData = await EconomyUser.findOne({ where: { id: user.id } });
	if (userData === undefined) {
		userData = new EconomyUser();
		userData.id = user.id;
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	if (!isSafeInteger(userData.wallet) || !isSafeInteger(userData.bank)) {
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	return userData;
};

export const fetchInventory = async (user: DiscordUser, item: Item): Promise<Inventory> => {
	const userData = await fetchUser(user);
	let inventory = await Inventory.findOne({ where: { userId: userData.id, itemID: item.id } });
	if (inventory === undefined) {
		inventory = new Inventory();
		inventory.userId = user.id;
		inventory.itemID = item.id;
		inventory.amount = 0;
		await inventory.save();
	}
	return inventory;
};

export const fetchGuild = async (guild: DiscordGuild): Promise<DBGuild> => {
	let guildData = await DBGuild.findOne({ where: { id: guild.id } });
	if (guildData === undefined) {
		guildData = new DBGuild();
		guildData.id = guild.id;
		guildData.prefix = '-';
		guildData.slotsMoneyPool = 0;
		guildData.slotsWinMultiplier = 0;
		await guildData.save();
	}
	return guildData;
};
