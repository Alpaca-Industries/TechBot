import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed, User } from 'discord.js';

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
	private async robCommandLogic(robber: User, robbedPerson: User): Promise<PepeBoy.CommandLogic> {
		if (robbedPerson === null)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed('You need to specify a server member to rob!', 'Invalid User')]
			};
		if (robber.id === robbedPerson.id)
			return {
				ephemeral: false,
				embeds: [generateErrorEmbed("You can't rob yourself.", 'Invalid User')]
			};
		if (robbedPerson.bot)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed("You can't rob bots!", 'Invalid User')]
			};

		const robbedUser = await fetchUser(robbedPerson);
		const robberData = await fetchUser(robber);

		if (robbedUser.passiveMode)
			return {
				ephemeral: true,
				embeds: [
					generateErrorEmbed(
						`<@${robbedPerson.id}> is in passive mode. Leave them alone!`,
						'User is in Passive Mode'
					)
				]
			};
		if (robberData.passiveMode)
			return {
				ephemeral: true,
				embeds: [generateErrorEmbed("You can't rob while in passive mode!", 'Passive Mode Enabled')]
			};

		const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(robberData.wallet * (Math.random() / 0.75));

		if (Math.random() > 0.6) {
			robberData.wallet -= lossAmount;
			await robberData.save();

			robbedUser.wallet += lossAmount;
			await robbedUser.save();

			const failedResponse = new MessageEmbed()
				.setDescription(`You failed to rob <@${robbedPerson.id}>, and lost **$${lossAmount}**!`)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robberData.wallet + lossAmount
					).toLocaleString()}\n- After: ${robberData.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${robbedPerson.tag}'s Balance`,
					`\`\`\`diff\n- Before:  ${(
						robbedUser.wallet - lossAmount
					).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			return { ephemeral: false, embeds: [failedResponse] };
		} else {
			robberData.wallet += winAmount;
			await robberData.save();

			robbedUser.wallet -= winAmount;
			await robbedUser.save();

			const successResponse = new MessageEmbed()
				.setDescription(
					`You successfully robbed <@${robbedPerson.id}>, and gained **$${winAmount}**!`
				)
				.setTitle('Rob Successful')
				.setColor('GREEN')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n- Before:  ${(
						robberData.wallet - winAmount
					).toLocaleString()}\n+ After: ${robberData.wallet.toLocaleString()}\`\`\``
				)
				.addField(
					`${robbedPerson.tag}'s Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robbedUser.wallet + winAmount
					).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}\`\`\``
				);

			return { ephemeral: false, embeds: [successResponse] };
		}
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const userToRob = await args.pick('user').catch(() => null);
		return message.reply(await this.robCommandLogic(message.author, userToRob));
	}

	async chatInputRun(interaction: CommandInteraction) {
		const userToRob = interaction.options.getUser('user');
		return interaction.reply(await this.robCommandLogic(interaction.user, userToRob));
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
