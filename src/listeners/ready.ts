import { ApplyOptions } from '@sapphire/decorators';
import type { ListenerOptions, SapphireClient } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready'
})
export default class ReadyListener extends Listener {
	run(client: SapphireClient): unknown {
		const { username, id } = client.user!;
		this.container.logger.info(`Successfully logged in as ${username} (${id})`);
		return;
	}
}
