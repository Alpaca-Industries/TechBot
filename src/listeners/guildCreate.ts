import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Guild as DiscordGuild } from 'discord.js';
import { Guild } from '../entities/guild';

@ApplyOptions<ListenerOptions>({
	event: 'guildCreate'
})
export default class guildCreateListener extends Listener {
	run(guild: DiscordGuild) {
		Guild.findOne({ where: { id: guild.id } }).then((dbGuild) => {
			if (dbGuild === undefined) {
				Guild.create({
					id: guild.id,
					prefix: '-'
				}).save();
			}
		});
	}
}
