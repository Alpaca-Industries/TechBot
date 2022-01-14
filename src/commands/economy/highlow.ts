import { Message, MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, Args, ApplicationCommandRegistry } from '@sapphire/framework';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'highlow',
	description: 'Bet if a number is lower/higher/exactly a second number.',
	detailedDescription: 'highlow'
})
export default class DailyCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const num = Math.floor(Math.random() * 100) + 1;
		const embed = new MessageEmbed().setDescription(`The first number is **${num}**.\nDo you think the second number will be \`higher\`, \`lower\`, or exactly (\`jackpot\`) it?`).setColor('BLUE').setTitle('Highlow Bet');

		const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('lower').setLabel('Lower').setStyle('SECONDARY'), new MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY'), new MessageButton().setCustomId('higher').setLabel('Higher').setStyle('SECONDARY'));

		const msg = await message.reply({ embeds: [embed], components: [row] });

		const user = await fetchUser(message.author);

		const filter = (interaction) => interaction.customId === 'higher' || interaction.customId === 'jackpot' || (interaction.customId === 'lower' && interaction.user.id === message.author.id);
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
				amount = Math.round(Math.random() * (1000 - 75) + 75);
			}

			if (won === true) {
				user.wallet += amount;
			} else {
				user.wallet -= amount;
			}

			const newEmbed = new MessageEmbed()
				.setTitle('Highlow')
				.setDescription(`You betted **${bet.toProperCase()}**, the first number was **${num}** and the second was **${testNum}**. So, you ${won ? 'won' : 'lost'} **$${amount}**.`)
				.setColor(won ? 'GREEN' : 'RED');

			const com = new MessageActionRow().addComponents(new MessageButton().setCustomId('lower').setLabel('Low').setStyle('SECONDARY').setDisabled(), new MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY').setDisabled(), new MessageButton().setCustomId('higher').setLabel('High').setStyle('SECONDARY').setDisabled());

			interaction.deferUpdate();

			msg.edit({ embeds: [newEmbed], components: [com] });
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		const num = Math.floor(Math.random() * 100) + 1;
		const embed = new MessageEmbed().setDescription(`The first number is **${num}**.\nDo you think the second number will be \`higher\`, \`lower\`, or exactly (\`jackpot\`) it?`).setColor('BLUE').setTitle('Highlow Bet');

		const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('lower').setLabel('Lower').setStyle('SECONDARY'), new MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY'), new MessageButton().setCustomId('higher').setLabel('Higher').setStyle('SECONDARY'));

		interaction.reply({ content: 'Made highlow bet successfully!', ephemeral: true });
		const msg = await interaction.channel.send({ embeds: [embed], components: [row] });

		const user = await fetchUser(interaction.user);

		const filter = (interaction) => interaction.customId === 'higher' || interaction.customId === 'jackpot' || (interaction.customId === 'lower' && interaction.user.id === interaction.user.id);
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
				amount = Math.round(Math.random() * (1000 - 75) + 75);
			}

			if (won === true) {
				user.wallet += amount;
			} else {
				user.wallet -= amount;
			}

			const newEmbed = new MessageEmbed()
				.setTitle('Highlow')
				.setDescription(`You betted **${bet.toProperCase()}**, the first number was **${num}** and the second was **${testNum}**. So, you ${won ? 'won' : 'lost'} **$${amount}**.`)
				.setColor(won ? 'GREEN' : 'RED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

			interaction.reply({ embeds: [newEmbed] });
			msg.delete();
			//msg.edit({embeds: [newEmbed], components: [com]});
		});
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}
}
