'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const jobs_1 = require('../../entities/economy/jobs');
const dbHelper_1 = require('../../helpers/dbHelper');
let jobCommand = class jobCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const toDo = interaction.options.getString('option');
		const value = interaction.options.getString('value');
		const guild = await (0, dbHelper_1.fetchGuild)(interaction.guild);
		const user = await (0, dbHelper_1.fetchUser)(interaction.user);
		switch (toDo) {
			case 'list':
				const jobs = await jobs_1.Jobs.createQueryBuilder('job').getMany();
				let i = 0;
				const fields = [];
				for (const job of jobs) {
					fields.push({
						name: `${i}: ${job.name.toProperCase()}`,
						value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
					});
					i++;
				}
				const listEmbed = new discord_js_1.MessageEmbed()
					.setTitle('Available Jobs')
					.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
					.setFooter({ text: `To get a job run ${guild.prefix}jobs select <job name>!` })
					.setColor(0x00ff00);
				await interaction.reply({ embeds: [listEmbed] });
				break;
			case 'select':
				if (value === null)
					return interaction.reply({ content: 'Please specify a job!', ephemeral: true });
				const job = await jobs_1.Jobs.findOne({ where: { name: value.replaceAll(' ', '_') } });
				if (job === undefined)
					return interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });
				user.currentJob = job.name;
				await user.save();
				await interaction.reply(`You're now working as **${job.name.toProperCase()}**.`);
				break;
			case 'current':
				const jobEmbed = new discord_js_1.MessageEmbed()
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
				const xpEmbed = new discord_js_1.MessageEmbed()
					.setTitle('Current XP')
					.setDescription(`${user.jobEXP.toLocaleString()} XP`)
					.setColor('BLUE');
				await interaction.reply({ embeds: [xpEmbed] });
				break;
			case 'help':
				const helpReply = new discord_js_1.MessageEmbed()
					.setTitle('Jobs')
					.setDescription(
						`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`
					)
					.setColor('BLUE');
				return interaction.reply({ embeds: [helpReply] });
		}
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('option')
						.setChoices([
							['list', 'List'],
							['select', 'Select'],
							['current', 'Current'],
							['xp', 'XP'],
							['help', 'Help']
						])
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('value')
						.setDescription('A value to pass in to the command. Only use if needed.')
						.setRequired(false)
				)
		);
	}
};
jobCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'job',
			description: 'Manage your job.',
			aliases: ['jobs'],
			detailedDescription: 'job [option] ...'
		})
	],
	jobCommand
);
exports.default = jobCommand;
//# sourceMappingURL=job.js.map
