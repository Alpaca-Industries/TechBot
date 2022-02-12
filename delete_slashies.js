const TOKEN = 'NzcyNjMyNzk0OTI0ODQzMDM4.X59gXQ.j9mHMU15a23LSAwoTcSV_D58cIM';

const { Client } = require('discord.js');
const client = new Client({
	intents: ['GUILD_INTEGRATIONS']
});
client.login(TOKEN);
client.once('ready', () => {
	console.log('Ready!');
	// Delete All Slash Commands
	client.application.commands.set([]).then(() => {
		console.log('Deleted all slash commands!');
	});
});
