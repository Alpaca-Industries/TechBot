import type { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { Inventory } from '../entities/economy/inventory';
import { Item } from '../entities/economy/item';
import { User as EconomyUser } from '../entities/economy/user';
import { Guild as DBGuild } from '../entities/guild';
export declare const fetchItemByName: (name: string) => Promise<Item>;
export declare const fetchUser: (user: DiscordUser) => Promise<EconomyUser>;
export declare const fetchInventory: (user: DiscordUser, item: Item) => Promise<Inventory>;
export declare const fetchGuild: (guild: DiscordGuild) => Promise<DBGuild>;
//# sourceMappingURL=dbHelper.d.ts.map
