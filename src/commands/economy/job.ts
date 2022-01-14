import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Jobs } from '../../entities/economy/jobs';
import { fetchUser } from '../../helpers/dbHelper';

@ApplyOptions<CommandOptions>({
	name: 'job',
	description: ''
})
export default class jobCommand extends Command {
	async messageRun(message: Message<boolean>, args: Args) {
		const toDo = await args.pick('string').catch(() => 'list');

		if (toDo === 'list') {
			const jobs = await Jobs.createQueryBuilder('job').getMany();

			// loop though jobs nad put them in an embed array
			let i = 0;
			const fields: { name: string; value: any }[] = [];
			for (const job of jobs) {
				fields.push({
					name: `${i}: ${job.name}`,
					value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
				});
				i++;
			}

			const jobsEmbed = new MessageEmbed()
				.setTitle('Available Jobs')
				.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
				.setFooter({ text: `To get a job run <prefix>jobs select <job name>!` })
				.setColor(0x00ff00);

			return message.reply({ embeds: [jobsEmbed] });
		}

		if (toDo === 'select') {
			const jobSelected = await args.pickResult('string');

			if (!jobSelected.success) return message.reply('Please specify a job!');

			const job = await Jobs.findOne({ where: { name: jobSelected.value } });

			if (job !== undefined) {
				fetchUser(message.author).then((user) => {
					user.currentJob = job.name;
					user.save();
				});

				return message.reply(`Your now working as ${job.name}`);
			}
		}

		return message.reply('Fuck you Greysilly7');
	}
}
