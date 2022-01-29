import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, User, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';
import { parseAmount } from '../../helpers/parseAmount';
import { pluralize } from '../../helpers/pluralize';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class giveMoneyCommand extends Command {
	private async logTransaction(sender: User, receiver?: User, item?: string, amount?: number) {
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		await webhook.send({
			embeds: [
				{
					title: 'User given money!',
					description: `${sender.tag} has given ${amount.toLocaleString()} to ${receiver.tag}.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});
	}

	private async giveMoneyCommandLogic(
		sender: User,
		receiver: User,
		amount: number
	): Promise<PepeBoy.CommandLogic> {
		const senderData = await fetchUser(sender);
		if (receiver.bot || receiver.id === sender.id)
			return { content: '', ephemeral: true, embeds: [generateErrorEmbed('Invalid User Specified!')] };
		if (amount < 0)
			return {
				content: '',
				ephemeral: true,
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			};

		if (senderData.wallet < amount)
			return {
				content: '',
				ephemeral: false,
				embeds: [generateErrorEmbed('You do not have that much money!')]
			};
		senderData.wallet -= amount;
		await senderData.save();

		const user = await fetchUser(receiver);
		user.wallet += amount;
		await user.save();

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
					senderData.wallet + amount
				).toLocaleString()}\n- After: ${senderData.wallet.toLocaleString()}\`\`\``,
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

		await this.logTransaction(sender, receiver, undefined, amount);
		return {
			embeds: [response],
			content: '',
			ephemeral: false
		};
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const receiver = await args.pickResult('user');
		const author = await fetchUser(message.author);
		const amount = parseAmount(await args.pick('string'), author);

		return message.reply(await this.giveMoneyCommandLogic(message.author, receiver.value, amount));
	}

	async chatInputRun(interaction: CommandInteraction) {
		const receiver = interaction.options.getUser('user');
		const author = await fetchUser(interaction.user);
		const amount = parseAmount(interaction.options.getString('amount'), author);

		return interaction.reply(await this.giveMoneyCommandLogic(interaction.user, receiver, amount));
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
