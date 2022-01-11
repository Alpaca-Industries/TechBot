import { ApplicationCommandRegistry, Args, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { WebhookClient, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/logging';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	aliases: ['with', 'withdrow'],
	detailedDescription: 'with <amount>'
})
export default class withdrawCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const amountToWithdraw = await args.rest('string').then((value) => {
			return Number(value) || 'all';
		});
		if (amountToWithdraw < 0) return message.channel.send({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] });

		let walletBalance: number;
		fetchUser(message.author).then((user) => {
			const addition = amountToWithdraw === 'all' ? walletBalance : amountToWithdraw;
			if (addition > user.bank) return message.channel.send({ embeds: [generateErrorEmbed("You don't have enough money in your bank to withdraw that much")] });
			walletBalance = user.wallet;
			user.wallet += addition;
			user.bank -= addition;
			user.save();

			// Send Message to Webhook
			// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
			const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
			const embed = new MessageEmbed().setTitle('User 927773203349246003').setDescription(`${message.author.tag} has withdrawn ${walletBalance.toLocaleString()} coins into their account.`).setColor('#00ff00').setTimestamp();
			webhook.send({ embeds: [embed] });

			return message.reply(`You withdrew ${amountToWithdraw.toLocaleString()} coins from your bank account`);
		});
	}
	async chatInputRun(interaction: CommandInteraction) {
		let amountToWithdraw: any = await interaction.options.getString('amount');
		amountToWithdraw = Number(amountToWithdraw) || 'all';
		if (amountToWithdraw < 0) return interaction.reply({ embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')] });

		let walletBalance: number;
		fetchUser(interaction.user).then((user) => {
			const addition = amountToWithdraw === 'all' ? walletBalance : amountToWithdraw;
			if (addition > user.bank) return interaction.reply({ embeds: [generateErrorEmbed("You don't have enough money in your bank to withdraw that much")] });
			walletBalance = user.wallet;
			user.wallet += addition;
			user.bank -= addition;
			user.save();

			// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
			const webhook = new WebhookClient({ id: '927773203349246003', token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi' });
			const embed = new MessageEmbed().setTitle('User 927773203349246003').setDescription(`${interaction.user.tag} has withdrawn ${amountToWithdraw.toLocaleString()} coins into their account.`).setColor('#00ff00').setTimestamp();
			webhook.send({ embeds: [embed] });

			return interaction.reply(`You withdrew ${amountToWithdraw.toLocaleString()} coins from your bank account`);
		});
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
