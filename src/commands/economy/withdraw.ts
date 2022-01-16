import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { WebhookClient, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';
import { parseAmount } from '../../helpers/parseAmount';
import { isSafeInteger } from '../../helpers/isSafeInteger';
import { getPrefix } from '../../helpers/getPrefix';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	aliases: ['with', 'withdrow'],
	detailedDescription: 'with <amount>'
})
export default class withdrawCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const user = await fetchUser(message.author);
		const arg = await args.rest('string');
		const amountToWithdraw = parseAmount(arg, user, false);

		if (isNaN(amountToWithdraw))
			return message.channel.send({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw'!)]
			});
		if (amountToWithdraw > user.bank)
			return message.channel.send({
				embeds: [generateErrorEmbed("You don't have enough money in your bank to withdraw that much")]
			});
		if (!isSafeInteger(amountToWithdraw))
			return message.reply({
				embeds: [
					generateErrorEmbed(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`${await getPrefix(
							message.guild
						)}${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				]
			});
		user.wallet += amountToWithdraw;
		user.bank -= amountToWithdraw;
		user.save();

		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('Withdraw')
			.setDescription(
				`${message.author.tag} (${
					message.author.id
				}) has withdrawn ${amountToWithdraw.toLocaleString()} coins from their bank account.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setDescription(`You withdrew **$${amountToWithdraw.toLocaleString()}** from your bank account.`)
			.setTitle('Withdraw')
			.setColor('BLUE');

		return message.reply({ embeds: [response] });
	}
	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount');
		const amountToWithdraw = parseAmount(arg, user, false);
		if (isNaN(amountToWithdraw))
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw'!)],
				ephemeral: true
			});
		if (amountToWithdraw > user.bank)
			return interaction.reply({
				embeds: [
					generateErrorEmbed("You don't have enough money in your bank to withdraw that much")
				],
				ephemeral: true
			});
		if (!isSafeInteger(amountToWithdraw))
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`${await getPrefix(
							interaction.guild
						)}${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				],
				ephemeral: true
			});
		user.wallet += amountToWithdraw;
		user.bank -= amountToWithdraw;
		user.save();

		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('Withdraw')
			.setDescription(
				`${interaction.user.tag} (${
					interaction.user.id
				}) has withdrawn ${amountToWithdraw.toLocaleString()} coins from their bank account.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setDescription(`You withdrew **$${amountToWithdraw.toLocaleString()}** from your bank account.`)
			.setTitle('Withdraw')
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'amount',
					type: 'STRING',
					description: 'The amount of coins to withdraw.',
					required: true
				}
			]
		});
	}
}
