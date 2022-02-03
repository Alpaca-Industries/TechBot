import type { ApplicationCommandRegistry, Args, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Guild, Message, MessageEmbed, User } from 'discord.js';

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
	private async jobCommandLogic(
		user: User,
		guild: Guild,
		todo: string,
		value: string,
		flags: string
	): Promise<PepeBoy.CommandLogic> {
		const guildData = await fetchGuild(guild);
		const userData = await fetchUser(user);

		switch (todo) {
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
					.setFooter({ text: `To get a job run ${guildData.prefix}jobs select <job name>!` })
					.setColor(0x00ff00);

				return { ephemeral: false, embeds: [listEmbed] };
			case 'select':
				if (value === null) return { embeds: [], content: 'Please specify a job!', ephemeral: true };

				const job = await Jobs.findOne({ where: { name: value.replaceAll(' ', '_') } });

				if (job === undefined)
					return { embeds: [], content: 'Please specify a valid job!', ephemeral: true };

				userData.currentJob = job.name;
				await userData.save();

				return {
					ephemeral: false,
					embeds: [],
					content: `You're now working as **${job.name.toProperCase()}**.`
				};
			case 'current':
				const jobEmbed = new MessageEmbed()
					.setTitle('Current Job')
					.setDescription(
						userData.currentJob !== 'jobless'
							? `Your current job is **${userData.currentJob.toProperCase()}**.`
							: 'You are currently **Unemployed**.'
					)
					.setColor('BLUE');

				return { ephemeral: false, embeds: [jobEmbed] };

			case 'xp':
				const xpEmbed = new MessageEmbed()
					.setTitle('Current XP')
					.setDescription(`${userData.jobEXP.toLocaleString()} XP`)
					.setColor('BLUE');

				return { ephemeral: false, embeds: [xpEmbed] };

			case 'help':
				const helpReply = new MessageEmbed()
					.setTitle('Jobs')
					.setDescription(
						`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`
					)
					.setColor('BLUE');

				return { ephemeral: false, embeds: [helpReply] };
		}
	}
	async messageRun(message: Message<boolean>, args: Args) {
		const toDo = await args.pick('string').catch(() => '');
		return message.reply(
			await this.jobCommandLogic(
				message.author,
				message.guild,
				toDo,
				await args.pick('string').catch(() => ''),
				await args.pick('string').catch(() => '')
			)
		);
	}

	async chatInputRun(interaction: CommandInteraction) {
		const toDo = interaction.options.getString('option');
		const value = interaction.options.getString('value');

		return interaction.reply(
			await this.jobCommandLogic(interaction.user, interaction.guild, toDo, value, '')
		);
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
