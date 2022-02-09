import type { Guild } from 'discord.js';
import { fetchGuild } from './dbHelper';
import { prefixCache } from '../index';

export async function getPrefix(guild: Guild): Promise<string> {
	// Check prefixCache for an entry if nonexistent prefix from DB
	if (prefixCache.has(guild.id)) {
		return prefixCache.get(guild.id);
	}
	return (await fetchGuild(guild)).prefix;
}

// This is just a shorthand helper for fetching the guild prefix
