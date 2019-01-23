const Discord = require("discord.js");
var mysql = require("mysql");
const bot = new Discord.Client();
const config = require("./auth.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
const citati = require("./citati.json");

bot.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
	//bot.channels.get('292273395524042752').send('Tukaj sem!');
	// Example of changing the bot's playing game to something useful. `bot.user` is what the
	// docs refer to as the "ClientUser".
	//bot.user.setActivity(`on ${bot.guilds.size} servers`);
	bot.user.setActivity(`you sleep.`,{type:'WATCHING'});
	bot.user.setStatus(`dnd`);
});
bot.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	bot.user.setActivity(`on ${bot.guilds.size} servers`);
});
bot.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	bot.user.setActivity(`on ${bot.guilds.size} servers`);
});
/*bot.on("voiceStateUpdate", (oldMember, newMember) => {
	console.log(`oldMember: ${oldMember.displayName}; newMember: ${newMember.displayName}`);
});*/
bot.on("message", async message => {
	// This event will run on every single message received, from any channel or DM.
	
	// It's good practice to ignore other bots. This also makes your bot ignore itself
	// and not get into a spam loop (we call that "botception").
	if(message.author.bot) return;
	
	// Also good practice to ignore any message that does not start with our prefix, 
	// which is set in the configuration file.
	if(message.isMentioned(bot.user)){
		message.channel.send("Me je kdo klical? 😠").then((message => message.delete(5000)));
		//console.log("Nekdo me je omenil.");
		return;
	}
	
	if(message.content.indexOf(config.prefix) !== 0) {
		//za ukaze brez predpone
		if(message.content.includes("butast bot")) message.channel.send("I AM NOT A MORON! 😠");
		else if(message.content.includes("🤖") || message.content.includes("robot")) message.channel.send("🤖");
		return;
	}
	
	// Here we separate our "command" name, and our "arguments" for the command. 
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	// Let's go with a few common example commands! Feel free to delete or change those.
	
	if(command === "ping2") {
		// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
		// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
		message.react('🏓');
		//m.react('🏓');
	}
	else if(command === "ping"){
		message.channel.send('Pong!');
	}
	else if(command === "ojla"){
		message.channel.send(citati.ojla[Math.floor(Math.random()*citati.ojla.length)]);
	}
	else if(command === "čas"){
		message.channel.send(new Date().toLocaleTimeString() + " ＿＿＿↑");
	}
	else if(command === "info"){
		message.channel.send('Zdravo. Sem testni bot za ta server <:TheCakeIsaLie:292273183627804672> Večino časa spim, ko pa sem buden, odgovarjam na povsem neuporabne komande. Če napišeš `' + config.prefix + 'pomoč`, ti pošljem seznam komand. Nisem preveč brihten, nisem pa idiot.');
	}
	else if(command === "grabme"){
		message.delete();
		message.channel.send('<a:GrabMe:431020293008654336>');
	}
	else if(command === "moron" || command === "mona"){
		message.channel.send(new Discord.RichEmbed({"image":{"url":"https://blaz.selj.eu/json/moron.jpg"}}));
		message.react('316250908940042240');
	}
	else if(command === "boolean"){
		message.channel.send(new Discord.RichEmbed({"image":{"url":"https://static.comicvine.com/uploads/original/12/122627/2968846-wheatley.jpg"}}));
	}
	
	else if(command === "asimov"){
		const asimovZakon = parseInt(args[0], 10);
		if(asimovZakon == 1) message.channel.send(citati.asimov[0],{code:true});
		else if(asimovZakon == 2) message.channel.send(citati.asimov[1],{code:true});
		else if(asimovZakon == 3) message.channel.send(citati.asimov[2],{code:true});
		else message.channel.send(citati.asimov[0]+"\n"+citati.asimov[1]+"\n"+citati.asimov[2],{code:true});
	}
	else if(command === "wheatley"){
		var wheatleyQ = parseInt(args[0], 10);
		if(wheatleyQ > 0 && wheatleyQ <= citati.wheatley.length) message.channel.send(citati.wheatley[wheatleyQ-1]);
		else message.channel.send(citati.wheatley[Math.round(Math.random()*citati.wheatley.length)]);
	}
	
	else if(command === "say") {
		// makes the bot say something and delete the message. As an example, it's open to anyone to use. 
		// To get the "message" itself we join the `args` back into a string with spaces: 
		const sayMessage = args.join(" ");
		// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
		message.delete().catch(O_o=>{}); 
		// And we get the bot to say the thing: 
		message.channel.send(sayMessage);
	}
	
	else if(command === "qr") {
		var qr_input = args.join(" ");
		var qr_naslov = "http://selj.eu/phpqrcode/QR-output.php?d=" + encodeURI(qr_input);
		message.delete().catch(O_o=>{});
		if(qr_input == "" || qr_input == null)
			message.channel.send("napaka; vnesi besedilo").then((message => message.delete(5000)));
		else message.channel.send(new Discord.RichEmbed().setDescription(qr_input).setImage(qr_naslov).setAuthor(message.author.username, message.author.avatarURL));
	}
	
	else if(command === "kick") {
		// This command must be limited to mods and admins. In this example we just hardcode the role names.
		// Please read on Array.some() to understand this bit: 
		// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
		if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
			return message.reply("Sorry, you don't have permissions to use this!");
		
		// Let's first check if we have a member and if we can kick them!
		// message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
		let member = message.mentions.members.first();
		if(!member)
			return message.reply("Please mention a valid member of this server");
		if(!member.kickable) 
			return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
		
		// slice(1) removes the first part, which here should be the user mention!
		let reason = args.slice(1).join(' ');
		if(!reason)
			return message.reply("Please indicate a reason for the kick!");
		
		// Now, time for a swift kick in the nuts!
		await member.kick(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
		message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
	}
	
	else if(command === "ban") {
		// Most of this command is identical to kick, except that here we'll only let admins do it.
		// In the real world mods could ban too, but this is just an example, right? ;)
		if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
			return message.reply("Sorry, you don't have permissions to use this!");
		
		let member = message.mentions.members.first();
		if(!member)
			return message.reply("Please mention a valid member of this server");
		if(!member.bannable) 
			return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
		let reason = args.slice(1).join(' ');
		if(!reason)
			return message.reply("Please indicate a reason for the ban!");
		
		await member.ban(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
		message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
	}
	
	else if(command === "gta") {
		if(args[0] == null || args[0] == "") return;
		const searchGTA = args.join("+");
		require("request")("http://gta.wikia.com/api/v1/Search/List?query=" + searchGTA + "&limit=1",
		function(err, res, body) {
			var data = JSON.parse(body);
			if (data && data.items) {
				message.channel.send(data.items[0].url);
			}
		});
	}
	
	else if(command === "lego") {
		if(args[0] == null || args[0] == "") return;
		const searchLEGO = args.join("+");
		require("request")("https://rebrickable.com/api/v3/lego/sets/?key=be4bc22d005c31e0f13b645f009f7d2c&search=" + searchLEGO,
		function(err, res, body) {
			var data = JSON.parse(body);
			if (data.count) {
			require("request")("https://rebrickable.com/api/v3/lego/themes/" + data.results[0].theme_id + "/?key=be4bc22d005c31e0f13b645f009f7d2c",
				function(err, res, body2) {
				message.channel.send(new Discord.RichEmbed().setAuthor("Rebrickable", "https://rebrickable.com/static/img/robo3b.png", "https://rebrickable.com").setTitle(data.results[0].set_num+": "+data.results[0].name).setURL(data.results[0].set_url).setImage(data.results[0].set_img_url).setColor(3385529).setFooter(JSON.parse(body2).name));
				});
			}
			else message.react("⛔");
		});
	}
	
	else if(command === "google") {
		if(args[0] == null || args[0] == "") return;
		const searchGoogle = args.join("+");
		message.channel.send("https://www.google.si/search?q=" + searchGoogle + "&btnI=");
	}
	
	else if(command === "purge") {
		// This command removes all messages from all users in the channel, up to 100.
		if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
			return message.reply("Sorry, you don't have permissions to use this!");
		// get the delete count, as an actual number.
		const deleteCount = parseInt(args[0], 10);
		
		// Ooooh nice, combined conditions. <3
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
		
		// So we get our messages, and delete them. Simple enough, right?
		//const fetched = await message.channel.fetchMessages({count: deleteCount});
		//message.channel.bulkDelete(fetched)
		message.channel.bulkDelete(deleteCount)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
	
	else if(command === "math") {
	require("request")("http://numbersapi.com/random/math?json",
		function(err, res, body) {
			var data = JSON.parse(body);
			if (data && data.text) {
				message.channel.send(data.text)
			}
		});
	}
	else if(command === "date") {
	require("request")("http://numbersapi.com/random/date?json",
		function(err, res, body) {
			var data = JSON.parse(body);
			if (data && data.text) {
				message.channel.send(data.text)
			}
		});
	}
	else if(command === "naključno") {
	require("request")("https://blaz.selj.eu/json",
		function(err, res, body) {
			if(err) {
				message.channel.send("Server verjetno ni zagnan.");
				return;
			}
			var data = JSON.parse(body);
			if (data && data.datum) {
				message.channel.send(new Discord.RichEmbed().setFooter(data.datum).setDescription(data.naključno.število + ", " + data.naključno.besedilo.kratko).addField("dolgo besedilo", data.naključno.besedilo.dolgo));
			}
		});
	}
	else if(command === "dadjoke") {
	require("request")("https://icanhazdadjoke.com/slack",
		function(err, res, body) {
			var data = JSON.parse(body);
			if (data.attachments[0].text) {
				message.channel.send(data.attachments[0].text);
			}
		});
	}
	else if(command === "test") {
			message.channel.send("Okay, almost there. On the other side of that wall is one of the old testing tracks. There's a piece of equipment in there we're gonna need to get out of here. I think this is a docking station. Get ready...");
	}
	else if(command === "help" || command === "pomoč") {
		var seznamKomand = citati.komande;
		var izpis = "***Seznam ukazov:***\n";
		for(var i = 0; i < seznamKomand.length; i++){
			izpis += "**" + config.prefix + seznamKomand[i].ime + "**";
			if(seznamKomand[i].uporaba){izpis += " " + seznamKomand[i].uporaba;};
			izpis += "\n	" + seznamKomand[i].opis + "\n";
		}
		if(args[0] == "tukaj" || args[0] == "here") message.channel.send(izpis);
		else message.author.send(izpis);
	}
	
	else if(command === "quote" || command === "citiraj")	{
		let channel = message.channel;
		if (args.length < 1) {
				throw 'You must provide a message ID';
		}
		if (!/^\d{18}$/.test(args[0])) {
				throw 'You must provide a valid message ID.';
		}
		if (args[1] && /^<#\d{18}>$|^\d{18}$/.test(args[1])) {
				channel = bot.channels.get(args[1].replace(/[<#>]/g, ''));
		}
		if (!channel) {
				throw 'That channel could not be found!';
		}
		const messages = await channel.fetchMessages({ around: args[0], limit: 1 });
		if (!messages || messages.size < 1) {
				throw 'That message could not be found!';
		}
		let mesg = messages.first();
		let options = {
				timestamp: mesg.editedTimestamp || mesg.createdTimestamp,
				footer: false
		};
		let attachment = mesg.attachments.first();
		if (attachment && (attachment.width || attachment.height)) {
				options.image = attachment.url;
		}
		let field = '';
		if ((message.guild || {}).id !== (channel.guild || {}).id) {
				field = `**in ${(channel.guild || { name: 'DMs' }).name} <#${channel.id}>:**`;
		} else if (channel.id !== message.channel.id) {
				field = `**in <#${channel.id}>:**`;
		}
		message.delete();
		message.channel.send(new Discord.RichEmbed().addField('Citiram:', field + '\n\n' + mesg.toString()).setAuthor(mesg.author.username, mesg.author.avatarURL).setFooter(mesg.createdAt.toDateString() + " v " + mesg.channel.name));
	}
	
	else if(command === "citat")	{
		var sqlcon = mysql.createConnection({
			host: "selj.eu",
			user: "seljeu34_node",
			password: "3cV=Y5fmy#eZ",
			database: "seljeu34_nodejs"
		});
		sqlcon.connect();
		var dolocenCitat = parseInt(args[0], 10);
		var vsebinaCitata = "";
		if(typeof dolocenCitat == "number") {
			sqlcon.query("SELECT ID, citat FROM citati_test", function (err, result, fields) {
				if (err) throw err;
				if(dolocenCitat<=result.length && dolocenCitat>0) {
					vsebinaCitata = result[dolocenCitat-1].ID + ". " + result[dolocenCitat-1].citat;
				}
				else if(dolocenCitat>=-result.length && dolocenCitat<0) {
					vsebinaCitata = result[dolocenCitat+result.length].ID + ". " + result[dolocenCitat+result.length].citat;
				}
				else {
					var nakljCitat = Math.floor(result.length*Math.random());
					vsebinaCitata = result[nakljCitat].ID + ". " + result[nakljCitat].citat;
				}
			});
		}
		else {
			sqlcon.query("SELECT ID, citat FROM citati_test", function (err, result, fields) {
				if (err) throw err;
				var nakljCitat = Math.floor(result.length*Math.random());
				vsebinaCitata = result[nakljCitat].ID + ". " + result[nakljCitat].citat;
			});
		}
		message.channel.send(vsebinaCitata);
		sqlcon.end();
		//priprava za zapis: mogoče Math.round(Date.now()/1000)
	}
	else if(command === "odds" || command === "c3po")	{
		var odds = Math.round(Math.random()*9999+3);
		if(odds%17) message.channel.send("<:c3po:536939630415577138> The odds are " + odds + " to 1.");
		else message.channel.send("<:HanSolo:537024515721527346> Never tell me the odds!");
	}
	
	else if(command.includes("/") || command.includes(".")) return;
	//if(citati.seznam.includes(command))	return;
	/*else if(citati.seznam2.includes(command)){
		try {
			let commandFile = require(`./commands/${command}.js`);
			commandFile.run(bot, message, args);
		} catch (err) {
			console.error(err);
		}
	}*/
	else message.channel.send("<:thinkingwithblobs:301315306373251073> Ne razumem. Potrebuješ `" + config.prefix + "pomoč`?");
});
bot.login(config.token);