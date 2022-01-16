import type { Guild } from 'discord.js';
import { fetchGuild } from './dbHelper';

export async function getPrefix(server: Guild): Promise<string> {
	return (await fetchGuild(server)).prefix;
}

// This is just a shorthand helper for fetching the guild prefix
