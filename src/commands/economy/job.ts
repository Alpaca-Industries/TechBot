import type { ApplicationCommandRegistry, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Jobs } from '../../entities/economy/jobs';
import { fetchGuild, fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'job',
	description: 'Manage your job.',
	aliases: ['jobs'],
	detailedDescription: 'job [option] ...'
})
export default class jobCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const toDo = interaction.options.getString('option');
		const value = interaction.options.getString('value');
		const guild = await fetchGuild(interaction.guild);
		const user = await fetchUser(interaction.user);

		switch (toDo) {
			case 'list':
				const jobs = await Jobs.createQueryBuilder('job').getMany();

				let i = 0;
				const fields: { name: string; value: any }[] = [];
				for (const job of jobs) {
					fields.push({
						name: `${i}: ${job.name.toProperCase()}`,
						value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
					});
					i++;
				}

				const listEmbed = new MessageEmbed()
					.setTitle('Available Jobs')
					.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
					.setFooter({ text: `To get a job run ${guild.prefix}jobs select <job name>!` })
					.setColor(0x00ff00);

				await interaction.reply({ embeds: [listEmbed] });
				break;
			case 'select':
				if (value === null)
					return interaction.reply({ content: 'Please specify a job!', ephemeral: true });

				const job = await Jobs.findOne({ where: { name: value.replaceAll(' ', '_') } });

				if (job === undefined)
					return interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });

				user.currentJob = job.name;
				await user.save();

				await interaction.reply(`You're now working as **${job.name.toProperCase()}**.`);
				break;
			case 'current':
				const jobEmbed = new MessageEmbed()
					.setTitle('Current Job')
					.setDescription(
						user.currentJob !== 'jobless'
							? `Your current job is **${user.currentJob.toProperCase()}**.`
							: 'You are currently **Unemployed**.'
					)
					.setColor('BLUE');

				await interaction.reply({ embeds: [jobEmbed] });
				break;

			case 'xp':
				const xpEmbed = new MessageEmbed()
					.setTitle('Current XP')
					.setDescription(`${user.jobEXP.toLocaleString()} XP`)
					.setColor('BLUE');

				await interaction.reply({ embeds: [xpEmbed] });
				break;

			case 'help':
				const helpReply = new MessageEmbed()
					.setTitle('Jobs')
					.setDescription(
						`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`
					)
					.setColor('BLUE');

				return interaction.reply({ embeds: [helpReply] });
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					name: 'option',
					type: 'STRING',
					description: 'The subset command to run.',
					required: true,
					choices: [
						{
							name: 'List',
							value: 'list'
						},
						{
							name: 'Select',
							value: 'select'
						},
						{
							name: 'XP',
							value: 'xp'
						},
						{
							name: 'Current',
							value: 'current'
						},
						{
							name: 'Help',
							value: 'help'
						}
					]
				},
				{
					name: 'value',
					type: 'STRING',
					description: 'A value to pass in to the command. Only use if needed.',
					required: false
				}
			]
		});
	}
}
