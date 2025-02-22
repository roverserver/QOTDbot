
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
    console.log('Loop beginning');
    runPost();
    setInterval(() => runPost(), 86400000);
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

function runPost() {
    try {
        var file = fs.readFileSync('questions.json')
        commands = JSON.parse(file);
        postIt();
    } catch (er) {
        console.log(er)
    }
}

function postIt() {
     const embed = {
        "color": 16312092,
        "description": `Du hast auch eine Idee für eine <@&${pingRole}>? \nSchick sie einfach [*hier*](${process.env.SUGGESTION_LINK}) rein :D`
    };
    if (0 < Object.keys(commands).length) {
        if (!!commands["0"]) {
            var question = commands["0"];
            for (var i = 0; i < Object.keys(commands).length; i++) {
                commands[i.toString()] = commands[(i + 1).toString()];
            }
            delete commands[Object.keys(commands).length.toString()];
            fs.writeFileSync('questions.json', JSON.stringify(commands))
            client.channels.cache.get(adminChannel).send(
                `Entferne Frage \`${question}\` aus der Liste. Länge der Liste: ${(Object.keys(commands).length - 1).toString()}`
            );
        }
	if(count == 4){
        	client.channels.cache.get(targetChannel).send(`<@&${pingRole}> ${question}`, { embed });
		count =0;	
	}
	else{
		client.channels.cache.get(targetChannel).send(`<@&${pingRole}> ${question}`);
		count++;
	}
	if(Object.keys(commands).length == 0){
		client.channels.cache.get(adminChannel).send(`Das war die letzte <@&${pingRole}> in der Liste.`);
	}

    } else { 	console.log("Keine Frage geladen!"); 
		client.channels.cache.get(adminChannel).send(`Keine <@&${pingRole}> mehr in der Liste!!!`);
	}
}

client.login(process.env.BOT_TOKEN);

