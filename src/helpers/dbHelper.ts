import { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { Inventory } from '../entities/economy/inventory';
import { Item } from '../entities/economy/item';
import { User as EconomyUser } from '../entities/economy/user';
import { Guild as DBGuild } from '../entities/guild';

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
	const userData = await EconomyUser.findOne({ where: { id: user.id } });
	if (userData === undefined) {
		await EconomyUser.insert({ id: user.id });
		return fetchUser(user);
	}
	return userData;
};

export const fetchInventory = async (user: DiscordUser, item: Item): Promise<Inventory> => {
	const userData = await fetchUser(user);
	let inventory = await Inventory.findOne({ where: { userId: userData.id, itemID: item.id } });
	if (inventory === undefined) {
		inventory = new Inventory();
		inventory.userId = userData.id;
		inventory.itemID = item.id;
		inventory.amount = 0;
		inventory.save();
		return fetchInventory(user, item);
	}
	return inventory;
};

export const findGuild = async (guild: DiscordGuild) => {
	const guildData = await DBGuild.findOne({ where: { id: guild.id } });
	if (guildData === undefined) {
		await DBGuild.insert({ id: guild.id, prefix: '-' });
		return findGuild(guild);
	}
	return guildData;
};
