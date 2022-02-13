import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: 'messageCreate'
})
export default class messageListener extends Listener {
	async run(message: Message<boolean>) {
		if (message.author.bot) return;
		if (message.content.startsWith(`<@!${message.client?.user?.id}>`)) {
			const embed = new MessageEmbed()
				.setTitle('Hello!')
				.setDescription(
					`I am a bot created by Greysilly7#8813, Spen#0999, and Haider#8515.\n\nI am a bot that can be used to manage your server\'s economy.\n\nTo get started, use the command \`help\` to see a list of commands. \n\n My Prefix is **${await message.client.fetchPrefix(
						message
					)}**`
				)
				.setColor(0x00ff00);
			return message.channel.send({ embeds: [embed] });
		}
		return;
	}
}
