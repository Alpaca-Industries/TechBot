import {
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEmbed
} from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'highlow',
	description: 'Bet if a number is lower/higher/exactly a second number.',
	detailedDescription: 'highlow',
	aliases: ['hl']
})
export default class DailyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
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

		await interaction.reply({ content: 'Made highlow bet successfully!', ephemeral: true });
		const msg = await interaction.channel?.send({ embeds: [embed], components: [row] });

		const user = await fetchUser(interaction.user);

		const filter = (interaction: MessageComponentInteraction) =>
			interaction.customId === 'higher' ||
			interaction.customId === 'jackpot' ||
			(interaction.customId === 'lower' && interaction.user.id === interaction.user.id);
		msg?.awaitMessageComponent({ filter, time: 30_000 }).then((interaction) => {
			const bet = interaction.customId;
			const testNum = Math.floor(Math.random() * 100) + 1;

			let won: boolean;
			if (bet === 'higher' && num < testNum) {
				won = true;
			} else if (bet === 'lower' && num > testNum) {
				won = true;
			} else won = bet === 'jackpot' && num === testNum;

			let amount: number;
			if (bet === 'jackpot' && won) {
				amount = Math.round(Math.random() * (10000 - 2000) + 2000);
			} else {
				amount = Math.round(Math.random() * (800 - 75) + 75);
			}

			if (won) {
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
				.setColor(won ? 'GREEN' : 'RED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

			interaction.reply({ embeds: [newEmbed] });
			msg.delete();
			//msg.edit({embeds: [newEmbed], components: [com]});
		});
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
	}
}
