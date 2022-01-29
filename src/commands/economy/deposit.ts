import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Guild, Message, MessageEmbed, User, WebhookClient } from 'discord.js';
import { parseAmount } from '../../helpers/parseAmount';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';
import { isSafeInteger } from '../../helpers/isSafeInteger';
import { getPrefix } from '../../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Lets your deposit coins into your bank account',
	aliases: ['dep', 'depos'],
	detailedDescription: 'deposit <amount>'
})
export default class depositCommand extends Command {
	private async logTransaction(sender: User, receiver?: User, amount?: number) {
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		await webhook.send({
			embeds: [
				{
					title: 'User Deposit',
					description: `${sender.tag} (${
						sender.id
					}) has deposited ${amount.toLocaleString()} coins into their account.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});
	}

	private async depositCommandLogic(
		user: User,
		guild: Guild,
		amount: string
	): Promise<PepeBoy.CommandLogic> {
		const userData = await fetchUser(user);
		const amountToDeposit = parseAmount(amount, userData, true);

		this.logTransaction(user, undefined, amountToDeposit);
		if (isNaN(amountToDeposit))
			return {
				content: '',
				embeds: [
					generateErrorEmbed(
						`'${amount}' is not a parsable integer.\nUsage: \`${await getPrefix(guild)}${
							this.detailedDescription
						}\``,
						'Invalid Number'
					)
				],
				ephemeral: true
			};
		if (amountToDeposit > userData.wallet)
			return {
				ephemeral: true,
				content: '',
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to deposit '${amount}'.\nUsage: \`${await getPrefix(
							guild
						)}${this.detailedDescription}\``,
						'Invalid Amount'
					)
				]
			};
		if (!isSafeInteger(amountToDeposit))
			return {
				ephemeral: true,
				content: '',
				embeds: [
					generateErrorEmbed(
						`'${amount}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`${await getPrefix(
							guild
						)}${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				]
			};

		userData.wallet -= amountToDeposit;
		userData.bank += amountToDeposit;
		await userData.save();

		const response = new MessageEmbed()
			.setDescription(`You deposited **$${amountToDeposit.toLocaleString()}** into your bank account.`)
			.setTitle('Deposit')
			.setColor('BLUE');

		return { ephemeral: false, content: '', embeds: [response] };
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const amount = await args.rest('string');
		return message.reply(await this.depositCommandLogic(message.author, message.guild, amount));
	}

	async chatInputRun(interaction: CommandInteraction) {
		const amount = interaction.options.getString('amount');

		return interaction.reply(await this.depositCommandLogic(interaction.user, interaction.guild, amount));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'amount',
					type: 'STRING',
					description: 'The amount of money to deposit.',
					required: true
				}
			]
		});
	}
}
