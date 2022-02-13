import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, SapphireClient } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready'
})
export default class ReadyListener extends Listener {
	run(client: SapphireClient) {
		const { username, id } = client.user!;
		this.container.logger.info(`Successfully logged in as ${username} (${id})`);
		// Generate Invite for bot with interations slope
		this.container.logger.info(
			this.container.client.generateInvite({
				scopes: ['bot', 'applications.commands', 'applications.store.update'],
				permissions: 'ADMINISTRATOR'
			})
		);
	}
}
