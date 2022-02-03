import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, User, WebhookClient } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchItemByName } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';

@ApplyOptions<CommandOptions>({
	name: 'giveItem',
	aliases: ['give-item', 'shareItem', 'share-item'],
	description: 'Allows you to give items to another user.',
	detailedDescription: 'give-item <user> <item> <amount>'
})
export default class giveItemCommand extends Command {
	private async logTransaction(sender: User, receiver?: User, item?: string, amount?: number) {
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		await webhook.send({
			embeds: [
				{
					title: 'User gave item!',
					description: `${sender.tag} has given ${amount.toLocaleString()} x${amount} ${item} to ${
						receiver.tag
					}.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});
	}

	private async giveItemLogic(
		user: User,
		userToGiveTo: User,
		itemToGive: string,
		amount: number
	): Promise<PepeBoy.CommandLogic> {
		if (userToGiveTo.id === user.id)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed('You cannot give money to yourself!')]
			};

		if (userToGiveTo.bot)
			return { ephemeral: true, embeds: [generateErrorEmbed('Invalid User Specified!')] };
		if (itemToGive === null)
			return { ephemeral: true, embeds: [generateErrorEmbed('Invalid Item Specified!')] };
		if (amount < 0)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			};

		// Senders Inventory
		const senderInventory = await fetchInventory(user, await fetchItemByName(itemToGive));

		if (senderInventory === undefined)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed('You do not have that item!')]
			};
		if (senderInventory.amount < amount)
			return {
				ephemeral: false,
				embeds: [generateErrorEmbed(`You do not have '${amount}' of that item!`)]
			};
		senderInventory.amount -= amount;
		senderInventory.save();

		// Receiver Inventory
		fetchInventory(userToGiveTo, await fetchItemByName(itemToGive)).then((inventory) => {
			inventory.amount += amount;
			inventory.save();
		});

		await this.logTransaction(user, userToGiveTo, itemToGive, amount);
		return {
			embeds: [],
			ephemeral: false,
			content: `You gave ${amount} ${itemToGive} to ${userToGiveTo.tag}.`
		};
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const userToGiveTo = await args.pickResult('user');
		const itemToGive = await args.restResult('string');
		const amount = await args.pick('integer').catch(() => 1);

		return message.reply(
			await this.giveItemLogic(message.author, userToGiveTo.value, itemToGive.value, amount)
		);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToGiveTo = interaction.options.getUser('user');
		const itemToGive = interaction.options.getString('item');
		const amount = Number(interaction.options.getString('amount'));

		return interaction.reply(
			await this.giveItemLogic(interaction.user, userToGiveTo, itemToGive, amount)
		);
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
					},
					{
						name: 'item',
						type: 'STRING',
						description: 'the item to transfer.',
						required: true
					}
				]
			},
			{ idHints: ['930278867833344050'] }
		);
	}
}
