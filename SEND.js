
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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('trying to send message');
    runPost();
});

function runPost() {
    try {
        var file = fs.readFileSync('questions.json')
        commands = JSON.parse(file);
        postIt();

    } catch (er) {
        console.log(er)
    }
    throw '';
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
            fs.writeFileSync('questions.json', JSON.stringify(commands));
            client.channels.cache.get(adminChannel).send(`fdt ${question}`);
            //client.channels.cache.get(targetChannel).send(`<@&${pingRole}> ${question}`, { embed });
        }
    } else { 	console.log("Keine Frage geladen!"); 
		client.channels.cache.get(adminChannel).send(`Keine fdt mehr in der Liste!!!`);
	}
}

client.login(process.env.BOT_TOKEN);

