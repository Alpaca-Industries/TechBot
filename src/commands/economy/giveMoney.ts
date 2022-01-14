import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/logging';
import { parseAmount } from '../../helpers/parseAmount';
import { pluralize } from '../../helpers/pluralize';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class giveMoneyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const receiver = await args.pickResult('user');
		const author = await fetchUser(message.author);
		const amount = parseAmount(await args.pick('string'), author);

		if (!receiver.success || receiver.value.bot || receiver.value.id === message.author.id)
			return message.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (amount < 0)
			return message.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			});

		if (author.wallet < amount)
			return message.reply({ embeds: [generateErrorEmbed('You do not have that much money!')] });
		author.wallet -= amount;
		author.save();

		const user = await fetchUser(receiver.value);
		user.wallet += amount;
		user.save();

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave money!')
			.setDescription(
				`${message.author.tag} has given ${amount.toLocaleString()} to ${receiver.value.tag}.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setTitle('Money Transferred')
			.setDescription(
				`You gave **$${amount.toLocaleString()}** ${pluralize('coin', amount)} to **${
					receiver.value.tag
				}**.`
			)
			.addField(
				'Your Balance',
				`\`\`\`diff\n+ Before: ${(
					author.wallet + amount
				).toLocaleString()}\n- After: ${author.wallet.toLocaleString()}\`\`\``,
				true
			)
			.addField(
				`${receiver.value.tag}'s Balance`,
				`\`\`\`diff\n- Before: ${(
					user.wallet - amount
				).toLocaleString()}\n+ After: ${user.wallet.toLocaleString()}\`\`\``,
				true
			)
			.setColor('BLUE');

		return message.reply({ embeds: [response] });
	}

	async chatInputRun(interaction: CommandInteraction) {
		const receiver = interaction.options.getUser('user');
		const author = await fetchUser(interaction.user);
		const amount = parseAmount(interaction.options.getString('amount'), author);

		if (receiver.bot || receiver.id === interaction.user.id)
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (isNaN(amount) || amount < 0)
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			});

		if (author.wallet < amount)
			return interaction.reply({ embeds: [generateErrorEmbed('You do not have that much money!')] });
		author.wallet -= amount;
		author.save();

		const user = await fetchUser(receiver);
		user.wallet += amount;
		user.save();

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave money!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} to ${receiver.tag}.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setTitle('Money Transferred')
			.setDescription(
				`You gave **$${amount.toLocaleString()}** ${pluralize('coin', amount)} to **${
					receiver.tag
				}**.`
			)
			.addField(
				'Your Balance',
				`\`\`\`diff\n+ Before: ${(
					author.wallet + amount
				).toLocaleString()}\n- After: ${author.wallet.toLocaleString()}\`\`\``,
				true
			)
			.addField(
				`${receiver.tag}'s Balance`,
				`\`\`\`diff\n- Before: ${(
					user.wallet - amount
				).toLocaleString()}\n+ After: ${user.wallet.toLocaleString()}\`\`\``,
				true
			)
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
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
						description: 'the user to transfer stuff to.',
						required: true
					},
					{
						name: 'amount',
						type: 'STRING',
						description: 'the amount of money to transfer.',
						required: true
					}
				]
			},
			{ idHints: ['930278952105283595'] }
		);
	}
}
