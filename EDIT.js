
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('dotenv').config();

var commands = {};
var adminRole = process.env.ADMIN_ROLE;
var adminChannel = process.env.ADMIN_CHANNEL;
var targetChannel = process.env.TARG_CHANNEL;
var serverID = process.env.SERVER_ID;
var pingRole = process.env.PING_ROLE;
var count = 0;
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('now listening to Commands');
});

client.on('message', msg => {


    try {
        if (msg.guild.available) {
            if (msg.guild.id == serverID && msg.member.roles.cache.some(x => x.id === adminRole) && msg.channel.id ==adminChannel) {
                if (msg.author.tag == client.user.tag) {
                    return;
                }

                //msg.content = msg.content.toLowerCase();
                var file = fs.readFileSync('questions.json')
                qs = JSON.parse(file);

                if (msg.content.toLowerCase() === 'savejson') {
                    client.users.cache.get(msg.author.id).send('Saved JSON', {
                        files: [
                            'questions.json'
                        ]
                    });
                }

                if (msg.content.startsWith('!addfdt')) {
                    var pattern = /"[^"]+"/g
                    var quotedText = msg.content.match(pattern);
                    if (!!quotedText && quotedText.length === 1) {
                        //quotedText[0] = '<@&${pingRole}> ' + quotedText[0];
                        var response = quotedText[0].replace(`"`, '').replace(`"`, '');
                        var command = Object.keys(qs).length.toString();
                        qs[command] = response;
                        fs.writeFileSync('questions.json', JSON.stringify(qs))
                        msg.channel.send(
                            `Frage \`${response}\` an Stelle "${command}" gespeichert`
                        );
                    }
                }

		if (msg.content.startsWith('!removefdt')) {
			var index = Object.keys(qs).length -1;
			delete qs[index];
			fs.writeFileSync('questions.json', JSON.stringify(qs))
             		msg.channel.send(
                            `Frage an Stelle ${index} entfernt`
                        );
                    
                }


                if (msg.content.startsWith('!fdtliste') || msg.content.startsWith('!listfdt')) {
                    var output = '';
                    for (var i = 0; i < Object.keys(qs).length; i++) {
                        output += i.toString() + `: ${qs[i.toString()]}\n`;
                    }
                    msg.channel.send(
                        `Aktuelle Liste: \n\`\`\`\n${output}\n\`\`\``
                    );
                }
            }
        }
    }
    catch (error) {
        console.log(error)
    }

});

client.login(process.env.BOT_TOKEN);

