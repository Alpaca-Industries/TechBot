import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { MessageEmbed, User } from 'discord.js';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'balance',
	aliases: ['bal', 'money', 'balance', 'cash'],
	description: "Returns a user's current balance.",
	detailedDescription: 'balance [user]'
})
export default class BalanceCommand extends Command {
	private async balanceCommandLogic(user: User): Promise<PepeBoy.CommandLogic> {
		const balance = await fetchUser(user);

		return {
			ephemeral: false,
			content: '',
			embeds: [
				new MessageEmbed()
					.setTitle(`${user.username}, this is your balance!`)
					.addField('Wallet:', balance.wallet.toLocaleString())
					.addField('Bank:', balance.bank.toLocaleString())
					.addField('Total:', (balance.wallet + balance.bank).toLocaleString())
					.setColor('#4EAFF6')
			]
		};
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await args.pick('user').catch(() => message.author);

		return message.reply(await this.balanceCommandLogic(user));
	}

	async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user', false) ?? interaction.user;

		return interaction.reply(await this.balanceCommandLogic(user));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
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
			},
			{ idHints: ['929891934556807180'] }
		);
	}
}
