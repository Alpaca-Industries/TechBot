import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../helpers/dbHelper';
import { generateErrorEmbed } from '../../helpers/embeds';

@ApplyOptions<CommandOptions>({
	name: 'rob',
	description: "Lets you rob another user's bank account.",
	detailedDescription: 'rob <user>'
})
export default class robCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const userToRob = await args.pickResult('member');

		if (!userToRob.success)
			return message.reply({
				embeds: [generateErrorEmbed('You need to specify a server member to rob!', 'Invalid User')]
			});
		if (message.author.id === userToRob.value.id)
			return message.reply({ embeds: [generateErrorEmbed("You can't rob yourself.", 'Invalid User')] });
		if (userToRob.value.user.bot)
			return message.reply({ embeds: [generateErrorEmbed("You can't rob bots!", 'Invalid User')] });

		const robbedUser = await fetchUser(userToRob.value.user);
		const robber = await fetchUser(message.author);

		if (robbedUser.passiveMode)
			return message.reply({
				embeds: [
					generateErrorEmbed(
						`<@${userToRob.value.user.id}> is in passive mode. Leave them alone!`,
						'User is in Passive Mode'
					)
				]
			});
		if (robber.passiveMode)
			return message.reply({
				embeds: [generateErrorEmbed("You can't rob while in passive mode!", 'Passive Mode Enabled')]
			});

		const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(robber.wallet * (Math.random() / 0.75));

		if (Math.random() > 0.6) {
			robber.wallet -= lossAmount;
			await robber.save();

			robbedUser.wallet += lossAmount;
			await robbedUser.save();

			const failedResponse = new MessageEmbed()
				.setDescription(
					`You failed to rob <@${userToRob.value.user.id}>, and lost **$${lossAmount}**!`
				)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robber.wallet + lossAmount
					).toLocaleString()}\n- After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.value.user.tag}'s Balance`,
					`\`\`\`diff\n- Before:  ${(
						robbedUser.wallet - lossAmount
					).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			return message.reply({ embeds: [failedResponse] });
		} else {
			robber.wallet += winAmount;
			await robber.save();

			robbedUser.wallet -= winAmount;
			await robbedUser.save();

			const successResponse = new MessageEmbed()
				.setDescription(
					`You successfully robbed <@${userToRob.value.user.id}>, and gained **$${winAmount}**!`
				)
				.setTitle('Rob Successful')
				.setColor('GREEN')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n- Before:  ${(
						robber.wallet - winAmount
					).toLocaleString()}\n+ After: ${robber.wallet.toLocaleString()}\`\`\``
				)
				.addField(
					`${userToRob.value.user.tag}'s Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robbedUser.wallet + winAmount
					).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}\`\`\``
				);

			message.reply({ embeds: [successResponse] });
		}
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToRob = interaction.options.getUser('user');
		if (!interaction.inGuild())
			return interaction.reply({
				embeds: [generateErrorEmbed('Please use this command in a server.', 'Guild Only Command')],
				ephemeral: true
			});

		if (interaction.user.id === userToRob.id)
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob yourself.", 'Invalid User')],
				ephemeral: true
			});
		if (userToRob.bot)
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob bots!", 'Invalid User')],
				ephemeral: true
			});

		const robbedUser = await fetchUser(userToRob);
		const robber = await fetchUser(interaction.user);

		if (robbedUser.passiveMode)
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`<@${userToRob.id}> is in passive mode. Leave them alone!`,
						'User is in Passive Mode'
					)
				],
				ephemeral: true
			});
		if (robber.passiveMode)
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob while in passive mode!", 'Passive Mode Enabled')],
				ephemeral: true
			});

		const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(robber.wallet * (Math.random() / 0.75));

		if (Math.random() > 0.6) {
			robber.wallet -= lossAmount;
			await robber.save();

			robbedUser.wallet += lossAmount;
			await robbedUser.save();

			const failedResponse = new MessageEmbed()
				.setDescription(`You failed to rob <@${userToRob.id}>, and lost **$${lossAmount}**!`)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robber.wallet + lossAmount
					).toLocaleString()}\n- After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n- Before:  ${(
						robbedUser.wallet - lossAmount
					).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			return interaction.reply({ embeds: [failedResponse] });
		} else {
			robber.wallet += winAmount;
			await robber.save();

			robbedUser.wallet -= winAmount;
			await robbedUser.save();

			const successResponse = new MessageEmbed()
				.setDescription(`You successfully robbed <@${userToRob.id}>, and gained **$${winAmount}**!`)
				.setTitle('Rob Successful')
				.setColor('GREEN')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n- Before:  ${(
						robber.wallet - winAmount
					).toLocaleString()}\n+ After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robbedUser.wallet + winAmount
					).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			interaction.reply({ embeds: [successResponse] });
		}
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
						description: 'The user to rob.',
						required: true
					}
				]
			},
			{ idHints: ['931782008408002560'] }
		);
	}
}