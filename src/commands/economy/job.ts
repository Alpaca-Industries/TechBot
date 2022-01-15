import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

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
	async messageRun(message: Message<boolean>, args: Args) {
		const toDo = await args.pick('string').catch(() => '');
		const guild = await fetchGuild(message.guild);
		const user = await fetchUser(message.author);

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

				message.reply({ embeds: [listEmbed] });
				break;
			case 'select':
				const jobSelected = await args.restResult('string');
				if (!jobSelected.success) return message.reply('Please specify a job!');
				const job = await Jobs.findOne({ where: { name: jobSelected.value.replaceAll(' ', '_') } });
				if (job === undefined) return message.reply('Please specify a valid job!');

				fetchUser(message.author).then((user) => {
					user.currentJob = job.name;
					user.save();
				});

				message.reply(`You're now working as **${job.name}**.`);
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

				message.reply({ embeds: [jobEmbed] });
				break;

			case 'xp':
			case 'exp':
				const xpEmbed = new MessageEmbed()
					.setTitle('Current XP')
					.setDescription(`${user.jobEXP.toLocaleString()} XP`)
					.setColor('BLUE');

				message.reply({ embeds: [xpEmbed] });
				break;

			default:
				const helpReply = new MessageEmbed()
					.setTitle('Jobs')
					.setDescription(
						`**${guild.prefix}job list** - Returns a list of all available jobs.\n**${guild.prefix}job select <value>** - Selects a job.\n**${guild.prefix}job current** - Returns your current job.\n**${guild.prefix}job xp** - Returns your current XP.`
					)
					.setColor('BLUE');

				return message.reply({ embeds: [helpReply] });
		}
	}

	async chatInputRun(interaction: CommandInteraction): Promise<unknown> {
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

				interaction.reply({ embeds: [listEmbed] });
				break;
			case 'select':
				if (value === null)
					return interaction.reply({ content: 'Please specify a job!', ephemeral: true });

				const job = await Jobs.findOne({ where: { name: value.replaceAll(' ', '_') } });

				if (job === undefined)
					return interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });

				user.currentJob = job.name;
				user.save();

				interaction.reply(`You're now working as **${job.name.toProperCase()}**.`);
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

				interaction.reply({ embeds: [jobEmbed] });
				break;

			case 'xp':
				const xpEmbed = new MessageEmbed()
					.setTitle('Current XP')
					.setDescription(`${user.jobEXP.toLocaleString()} XP`)
					.setColor('BLUE');

				interaction.reply({ embeds: [xpEmbed] });
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
