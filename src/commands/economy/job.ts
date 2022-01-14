import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

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
		const toDo = await args.pick('string').catch(() => 'help');
		const guild = await fetchGuild(message.guild);

		if (toDo === 'list') {
			const jobs = await Jobs.createQueryBuilder('job').getMany();

			// loop though jobs nad put them in an embed array
			let i = 0;
			const fields: { name: string; value: any }[] = [];
			for (const job of jobs) {
				fields.push({
					name: `${i}: ${job.name.toProperCase()}`,
					value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
				});
				i++;
			}

			const jobsEmbed = new MessageEmbed()
				.setTitle('Available Jobs')
				.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
				.setFooter({ text: `To get a job run ${guild.prefix}jobs select <job name>!` })
				.setColor(0x00ff00);

			return message.reply({ embeds: [jobsEmbed] });
		}

		if (toDo === 'select') {
			const jobSelected = await args.restResult('string');

			if (!jobSelected.success) return message.reply('Please specify a job!');

			const job = await Jobs.findOne({ where: { name: jobSelected.value.replaceAll(' ', '_') } });

			if (job === undefined) return message.reply('Please specify a valid job!');
			fetchUser(message.author).then((user) => {
				user.currentJob = job.name;
				user.save();
			});

			return message.reply(`Your now working as ${job.name}`);
		}

		if (toDo === 'current') {
			const user = await fetchUser(message.author);
			const response = new MessageEmbed()
				.setTitle('Current Job')
				.setDescription(
					user.currentJob !== 'jobless'
						? `Your current job is **${user.currentJob.toProperCase()}**.`
						: 'You are currently **Unemployed**.'
				)
				.setColor('BLUE');

			message.reply({ embeds: [response] });
		}

		if (toDo === 'xp' || toDo === 'exp') {
			const user = await fetchUser(message.author);
			const response = new MessageEmbed()
				.setTitle('Current XP')
				.setDescription(`${user.jobEXP.toLocaleString()} XP`)
				.setColor('BLUE');

			message.reply({ embeds: [response] });
		}

		if (toDo === 'help') {
			const helpReply = new MessageEmbed()
				.setTitle('Jobs')
				.setDescription(
					`**${guild.prefix}job list** - Returns a list of all available jobs.\n**${guild.prefix}job select <job name>** - Selects a job.\n**${guild.prefix}job current** - Returns your current job.\n**${guild.prefix}job xp** - Returns your current XP.`
				)
				.setColor('BLUE');

			return message.reply({ embeds: [helpReply] });
		}
	}
}
