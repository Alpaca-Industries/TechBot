'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const framework_1 = require('@sapphire/framework');
const discord_js_1 = require('discord.js');
const decorators_1 = require('@sapphire/decorators');
const dbHelper_1 = require('../../helpers/dbHelper');
const embeds_1 = require('../../helpers/embeds');
let robCommand = class robCommand extends framework_1.Command {
	async chatInputRun(interaction) {
		const userToRob = interaction.options.getUser('user');
		if (!interaction.inGuild())
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						'Please use this command in a server.',
						'Guild Only Command'
					)
				],
				ephemeral: true
			});
		if (interaction.user.id === userToRob.id)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)("You can't rob yourself.", 'Invalid User')],
				ephemeral: true
			});
		if (userToRob.bot)
			return interaction.reply({
				embeds: [(0, embeds_1.generateErrorEmbed)("You can't rob bots!", 'Invalid User')],
				ephemeral: true
			});
		const robbedUser = await (0, dbHelper_1.fetchUser)(userToRob);
		const robber = await (0, dbHelper_1.fetchUser)(interaction.user);
		if (robbedUser.passiveMode)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						`<@${userToRob.id}> is in passive mode. Leave them alone!`,
						'User is in Passive Mode'
					)
				],
				ephemeral: true
			});
		if (robber.passiveMode)
			return interaction.reply({
				embeds: [
					(0, embeds_1.generateErrorEmbed)(
						"You can't rob while in passive mode!",
						'Passive Mode Enabled'
					)
				],
				ephemeral: true
			});
		const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(robber.wallet * (Math.random() / 0.75));
		if (Math.random() > 0.6) {
			robber.wallet -= lossAmount;
			await robber.save();
			robbedUser.wallet += lossAmount;
			await robbedUser.save();
			const failedResponse = new discord_js_1.MessageEmbed()
				.setDescription(`You failed to rob <@${userToRob.id}>, and lost **$${lossAmount}**!`)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robber.wallet + lossAmount
					).toLocaleString()}\n- After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n- Before:  ${(
						robbedUser.wallet - lossAmount
					).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);
			return interaction.reply({ embeds: [failedResponse] });
		} else {
			robber.wallet += winAmount;
			await robber.save();
			robbedUser.wallet -= winAmount;
			await robbedUser.save();
			const successResponse = new discord_js_1.MessageEmbed()
				.setDescription(`You successfully robbed <@${userToRob.id}>, and gained **$${winAmount}**!`)
				.setTitle('Rob Successful')
				.setColor('GREEN')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n- Before:  ${(
						robber.wallet - winAmount
					).toLocaleString()}\n+ After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robbedUser.wallet + winAmount
					).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);
			return interaction.reply({ embeds: [successResponse] });
		}
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setRequired(true).setDescription('The user to rob.')
				)
		);
	}
};
robCommand = (0, tslib_1.__decorate)(
	[
		(0, decorators_1.ApplyOptions)({
			name: 'rob',
			description: "Lets you rob another user's bank account.",
			detailedDescription: 'rob <user>'
		})
	],
	robCommand
);
exports.default = robCommand;
//# sourceMappingURL=rob.js.map
