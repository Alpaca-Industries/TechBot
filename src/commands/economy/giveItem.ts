import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, WebhookClient } from 'discord.js';

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
	async messageRun(message: Message<boolean>, args: Args) {
		const userToGiveTo = await args.pickResult('user');
		const itemToGive = await args.restResult('string');
		const amount = await args.pick('integer').catch(() => 1);

		if (userToGiveTo.value.id === message.author.id)
			return message.channel.send({
				embeds: [generateErrorEmbed('You cannot give money to yourself!')]
			});

		if (!userToGiveTo.success || userToGiveTo.value.bot)
			return message.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (itemToGive.value === null)
			return message.channel.send({ embeds: [generateErrorEmbed('Invalid Item Specified!')] });
		if (amount < 0)
			return message.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			});

		// Senders Inventory
		fetchInventory(message.author, await fetchItemByName(itemToGive.value)).then((inventory) => {
			if (inventory === undefined)
				return message.reply({ embeds: [generateErrorEmbed('You do not have that item!')] });
			if (inventory.amount < amount)
				return message.channel.send({
					embeds: [generateErrorEmbed(`You do not have '${amount}' of that item!`)]
				});
			inventory.amount -= amount;
			inventory.save();
			return null;
		});

		// Receiver Inventory
		fetchInventory(userToGiveTo.value, await fetchItemByName(itemToGive.value)).then((inventory) => {
			inventory.amount += amount;
			inventory.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave item!')
			.setDescription(
				`${message.author.tag} has given ${amount.toLocaleString()} ${itemToGive.value} to ${
					userToGiveTo.value.tag
				}.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		webhook.send({ embeds: [embed] });

		return message.reply(`You gave ${amount} ${itemToGive.value} to ${userToGiveTo.value.tag}.`);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToGiveTo = interaction.options.getUser('user');
		const itemToGive = interaction.options.getString('item');
		const amount = Number(interaction.options.getString('amount'));

		if (userToGiveTo.id === interaction.user.id)
			return interaction.reply({ embeds: [generateErrorEmbed('You cannot give money to yourself!')] });

		if (userToGiveTo.bot)
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (itemToGive === null)
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid Item Specified!')] });
		if (amount < 0)
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			}); // return message.reply('Please specify a valid amount of money to withdraw');
		// Senders Inventory
		fetchInventory(interaction.user, await fetchItemByName(itemToGive)).then((inventory) => {
			if (inventory === undefined) return interaction.reply('You do not have that item');
			if (inventory.amount < amount)
				return interaction.reply({
					embeds: [generateErrorEmbed('You do not have that much of that item!')]
				});
			inventory.amount -= amount;
			inventory.save();
			return null;
		});
		// Recievers Inventory
		fetchInventory(userToGiveTo, await fetchItemByName(itemToGive)).then((inventory) => {
			inventory.amount += amount;
			inventory.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave item!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} ${itemToGive} to ${
					userToGiveTo.tag
				}.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		webhook.send({ embeds: [embed] });

		return interaction.reply(`You gave ${amount} ${itemToGive} to ${userToGiveTo.username}`);
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
