import { Message, MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, Args, ApplicationCommandRegistry } from '@sapphire/framework';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'highlow',
	description: 'Bet if a number is lower/higher/exactly a second number.',
	detailedDescription: 'highlow',
	aliases: ['hl']
})
export default class DailyCommand extends Command {
	private async dailyCommandLogic(message?: Message, interaction?: CommandInteraction) {
		const num = Math.floor(Math.random() * 100) + 1;
		const embed = new MessageEmbed()
			.setDescription(
				`The first number is **${num}**.\nDo you think the second number will be \`higher\`, \`lower\`, or exactly (\`jackpot\`) it?`
			)
			.setColor('BLUE')
			.setTitle('Highlow Bet');

		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('lower').setLabel('Lower').setStyle('SECONDARY'),
			new MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY'),
			new MessageButton().setCustomId('higher').setLabel('Higher').setStyle('SECONDARY')
		);

		let msg: Message;
		let user;
		if (interaction !== null) {
			msg = await interaction.channel.send({ embeds: [embed], components: [row] });
			user = await fetchUser(interaction.user);
		} else {
			msg = await message.channel.send({ embeds: [embed], components: [row] });
			user = await fetchUser(message.author);
		}

		const filter = (interaction) =>
			interaction.customId === 'higher' ||
			interaction.customId === 'jackpot' ||
			(interaction.customId === 'lower' &&
				interaction.user.id === (interaction === null ? message.author.id : interaction.user.id));
		msg.awaitMessageComponent({ filter, time: 30_000 }).then((interaction) => {
			const bet = interaction.customId;
			const testNum = Math.floor(Math.random() * 100) + 1;

			let won: boolean;
			if (bet === 'higher' && num < testNum) {
				won = true;
			} else if (bet === 'lower' && num > testNum) {
				won = true;
			} else if (bet === 'jackpot' && num === testNum) {
				won = true;
			} else {
				won = false;
			}

			let amount: number;
			if (bet === 'jackpot' && won) {
				amount = Math.round(Math.random() * (10000 - 2000) + 2000);
			} else {
				amount = Math.round(Math.random() * (800 - 75) + 75);
			}

			if (won === true) {
				user.wallet += amount;
			} else {
				user.wallet -= amount;
			}

			const newEmbed = new MessageEmbed()
				.setTitle('Highlow')
				.setDescription(
					`You betted **${bet.toProperCase()}**, the first number was **${num}** and the second was **${testNum}**. So, you ${
						won ? 'won' : 'lost'
					} **$${amount}**.`
				)
				.setColor(won ? 'GREEN' : 'RED');

			const com = new MessageActionRow().addComponents(
				new MessageButton().setCustomId('lower').setLabel('Low').setStyle('SECONDARY').setDisabled(),
				new MessageButton()
					.setCustomId('jackpot')
					.setLabel('Jackpot')
					.setStyle('SECONDARY')
					.setDisabled(),
				new MessageButton().setCustomId('higher').setLabel('High').setStyle('SECONDARY').setDisabled()
			);

			if (interaction !== null) {
				interaction.reply({ embeds: [newEmbed] });
				msg.delete();
				return;
			}
			interaction.deferUpdate();
			msg.edit({ embeds: [newEmbed], components: [com] });
		});
	}
	async messageRun(message: Message<boolean>, args: Args) {
		await this.dailyCommandLogic(message, null);
	}

	async chatInputRun(interaction: CommandInteraction) {
		await this.dailyCommandLogic(null, interaction);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
