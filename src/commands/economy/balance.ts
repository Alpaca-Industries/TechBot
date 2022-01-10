import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'balance',
	aliases: ['bal', 'money', 'balance', 'cash'],
	description: "Returns a user's current balance.",
	detailedDescription: 'balance [user]'
})
export default class BalanceCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const balanceEmbed = new MessageEmbed();
		const user = await args.pick('user').catch(() => message.author);

		const balance = await fetchUser(user);

		balanceEmbed.setTitle(`${user.username}, This is your balance!`).addField('Wallet: ', balance.wallet.toLocaleString()).addField('Bank: ', balance.bank.toLocaleString()).setColor('#20ce1f');

		return message.channel.send({ embeds: [balanceEmbed] });
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
		const balanceEmbed = new MessageEmbed();
		const user = interaction.options.getUser('user', false) || interaction.user;
		const balance = await fetchUser(user);
		balanceEmbed.setTitle(`${user.username}, This is your balance!`).addField('Wallet: ', balance.wallet.toLocaleString()).addField('Bank: ', balance.bank.toLocaleString()).setColor('#20ce1f');
		return interaction.reply({ embeds: [balanceEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The user to get the balance of.',
					required: false
				}
			]
		});
	}
}
