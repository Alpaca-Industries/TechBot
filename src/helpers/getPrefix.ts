import { fetchGuild } from './dbHelper';

export async function getPrefix(server: any) {
	const guild = await fetchGuild(server);
	return guild.prefix;
}

// This is just a shorthand helper for fetching the guild prefix
