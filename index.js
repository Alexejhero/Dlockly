require('dotenv').config();

const DBL = require('dblapi.js');
const Discord = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const auth = require('./src/auth');
const discord = require('./src/discord');
const dlockly = require('./src/dlockly');
const init = require('./src/init');
const perms = require('./src/perms');
const premium = require('./src/premium');
const votes = require('./src/votes');

const events = require('./config/events.json');

const web = express();
web.set("views", __dirname);
web.use(require('cookie-parser')());
web.use(require('body-parser').json());
web.use(require('body-parser').urlencoded({
  extended: false
}));

module.exports.bot = new Discord.Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
});
init.bot();

module.exports.db = require('better-sqlite3')('data/db.db');
init.db();

module.exports.dbl = new DBL(process.env.DBL_TOKEN, {
  webhookPort: process.env.PORT,
  webhookAuth: process.env.DBL_WEBHOOK_AUTH,
  webhookServer: web.listen(process.env.PORT),
}, this.bot);
init.dbl();

web.all('*', async (req, res) => {
  var {
    authUserID,
    authSession
  } = auth.getCookies(req);
  var user = await this.bot.users.fetch(authUserID);

  if (fs.existsSync(path.join(__dirname, "/api/", req.path + ".js")))
    return require('./' + path.join('api/', req.path))({
      authSession,
      authUserID,
      res,
      req,
      user,
    });
  if (/[\s\S]*?.[html|css|js|ico|ttf|png|jpg]$/g.test(req.path))
    return res.sendFile(path.join(__dirname, req.path));

  if (!auth.sessionValid(authUserID, authSession))
    return res.render(path.join(__dirname, "www/html/login.ejs"));
  if (!user)
    return res.render(path.join(__dirname, "www/html/unknownuser.ejs"));

  if (!discord.getAllConfigurableGuilds(user).map(g => g.id).includes(req.query.guild))
    return res.render("www/html/guildpicker.ejs", {
      user,
      adminGuilds: discord.getConfigurableGuilds(user, true).sort(discord.guildSort),
      configurableGuilds: discord.getConfigurableGuilds(user).sort(discord.guildSort),
    });

  var dlocklyInstance = dlockly.initialize(premium.hasPremium(req.query.guild));

  res.render("www/html/dlockly.ejs", {
    blocklyXml: dlockly.getBlocklyXml(req.query.guild),
    blocks: dlocklyInstance.blocks,
    categories: dlocklyInstance.categories,
    exampleXml: dlockly.getExampleXml(),
    generators: dlocklyInstance.generators,
    guildId: req.query.guild,
    guildName: this.bot.guilds.cache.get(req.query.guild).name,
    invite: perms.isAdmin(user),
    premium: premium.hasPremium(req.query.guild),
    max: JSON.stringify(dlocklyInstance.max),
    mutators: dlocklyInstance.mutators,
    restrictions: JSON.stringify(dlocklyInstance.restrictions),
    xmlCategoryTree: dlockly.generateXmlTreeRecursively(dlocklyInstance.categories),
  });
});

this.bot.on("message", message => {
  if (!message.content.startsWith("d!")) return;
  if (!perms.isAdmin(message.author)) return;
  if (message.author.bot) return;

  var args = message.content.substring(2).split(/ +/g);
  var command = args.shift();

  switch (command) {
    case "eval":
      eval(args.join(" "));
      break;
    case "votes":
      try {
        if (message.mentions.users.size != 1)
          return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Invalid Usage")
            .setDescription("You must mention exactly one user")
            .setColor(0xEB144C));
        if (!args[0].match(/<@!?[0-9]*>/g))
          return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Invalid Usage")
            .setDescription("Expected a user mention as the first argument")
            .setColor(0xEB144C));
        if (isNaN(Number(args[1])) || !isFinite(Number(args[1])))
          return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Invalid Usage")
            .setDescription("Expected a finite non-zero number as the second argument")
            .setColor(0xEB144C));

        if (Number(args[1]) != 0) {
          votes.addVotes(message.mentions.users.first().id, Number(args[1]));
          if (Number(args[1]) > 0) {
            message.channel.send(new Discord.MessageEmbed()
              .setTitle("Success")
              .setDescription(`${message.mentions.users.first()} has received ${Number(args[1])} vote${Number(args[1]) == 1 ? "" : "s"}!`)
              .setColor(0x00D084)
              .addField("Total Votes", String(votes.getTotalVotes(message.mentions.users.first().id))));
          } else {
            message.channel.send(new Discord.MessageEmbed()
              .setTitle("Success")
              .setDescription(`${message.mentions.users.first()} has lost ${Number(args[1]) * -1} vote${Number(args[1]) == -1 ? "" : "s"}!`)
              .setColor(0x00D084)
              .addField("Total Votes", String(votes.getTotalVotes(message.mentions.users.first().id))));
          }
        } else {
          message.channel.send(new Discord.MessageEmbed()
            .setTitle("Invalid Usage")
            .setDescription(`Expected a finite non-zero number as the second argument`)
            .setColor(0xEB144C));
        }
      } catch (e) {
        console.log(e);
      }
  }
});

for (var event in events) {
  if (events.hasOwnProperty(event)) {
    var parameters = events[event].parameters;
    var check = events[event].check;
    var guild = events[event].guildGetter;

    try {
      eval(`this.bot.on('${event}', (${parameters.join(",")}) => {
              if (!(${check})) return;
              var guild = ${guild};
              var p = path.join(__dirname, "data", guild.id, "config.js");
              if (fs.existsSync(p)) {
                var module = require(p);
                console.log(guild.id + ": ${event}");
                if (module.${event}) { 
                  module.${event}(${parameters.join(",")});
                }
                require('decache')(p);
              }
            });`);
    } catch (e) {
      console.error(e);
    }
  }
}
