import { User } from "discord.js";
import { Inventory } from "../entities/economy/inventory";
import { Item } from "../entities/economy/item";
import { User as EconomyUser } from "../entities/economy/user";

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

export const findItemByName = (name: string): Promise<Item> => {
    return Item.findOne({ where: { name: name } });
};

export const fetchUser = async (user: User): Promise<EconomyUser> => {
	// Look for user if not exist make new one and return
	const userData = await EconomyUser.findOne({ where: { id: user.id } });
	if (!userData) {
		await EconomyUser.insert({ id: user.id });
		return fetchUser(user);
	}
	return userData;
}

export const fetchInventory = async (user: User, item: Item): Promise<Inventory> => {
	const userData = await fetchUser(user);
	let inventory = await Inventory.findOne({ where: { userId: userData.id, itemID: item.id } });
	if (inventory === null) {
		inventory = new Inventory();
		inventory.userId = userData.id;
		inventory.itemID = item.id;
		inventory.amount = 0;
		return inventory;
	}
	return inventory;
}