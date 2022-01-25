import type { Guild } from 'discord.js';
import { fetchGuild } from './dbHelper';

export async function getPrefix(guild: Guild): Promise<string> {
	return (await fetchGuild(guild)).prefix;
}

// This is just a shorthand helper for fetching the guild prefix
