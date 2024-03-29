'use strict';
require('dotenv').config();

const DBL = require('dblapi.js');
const decache = require('decache');
const Discord = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const auth = require('./src/auth');
const discord = require('./src/discord');
const dlockly = require('./src/dlockly');
const init = require('./src/init');
const perms = require('./src/perms');
const themes = require('./src/themes');
const votes = require('./src/votes');

const events = require('./config/events.json');

const web = express();
web.set("views", __dirname);
web.use(require('express-useragent').express());
web.use(require('cookie-parser')());
web.use(require('body-parser').json());
web.use(require('body-parser').urlencoded({
  extended: false
}));

module.exports.db = require('better-sqlite3')('data/db.db');
module.exports.bot = new Discord.Client({
  fetchAllMembers: true,
});
module.exports.dbl = new DBL(process.env.DBL_TOKEN, {
  webhookPort: process.env.PORT,
  webhookAuth: process.env.DBL_WEBHOOK_AUTH,
  webhookServer: web.listen(process.env.PORT),
}, this.bot);

init();

web.all('*', async (req, res) => {
  var browser = req.useragent.browser;

  var {
    authUserID,
    authSession
  } = auth.getCookies(req);
  var user = await discord.getUser(authUserID);

  if (req.path.endsWith(".js") || req.path.endsWith(".css") || req.path.endsWith(".ico") || req.path.endsWith(".html")) {
    res.sendFile(path.join(__dirname, req.path));
  } else if (fs.existsSync(path.join(__dirname, "/config/disable"))) {
    res.render(path.join(__dirname, "/www/html/maintenance.ejs"));
    return;
  } else if (fs.existsSync(path.join(__dirname, "/src/requests/", req.path + ".js"))) {
    require('./' + path.join('src/requests/', req.path))({
      authSession,
      authUserID,
      res,
      req,
      user,
    });
  } else {
    if (!auth.sessionValid(authUserID, authSession)) {
      res.render(path.join(__dirname, "/www/html/login.ejs"));
      return;
    }

    if (!user) {
      res.render(path.join(__dirname, "/www/html/unknownuser.ejs"), {
        theme: themes.getTheme(req),
      });
      return;
    }

    if (!discord.getConfigurableGuilds(user).concat(discord.getConfigurableGuilds(user, true)).map(g => g.id).includes(req.query.guild)) {
      res.render("www/html/guildpicker.ejs", {
        user: user,
        adminGuilds: discord.getConfigurableGuilds(user, true).sort(discord.guildSort),
        configurableGuilds: discord.getConfigurableGuilds(user).sort(discord.guildSort),
      });
      return;
    }

    var categories = dlockly.initializeAllCategoriesRecursively();
    var {
      blocks,
      max,
      restrictions,
      generators
    } = dlockly.initializeAllBlocks(categories);

    res.render("www/html/dlockly.ejs", {
      blocks: blocks,
      max: JSON.stringify(max),
      categories: categories,
      restrictions: JSON.stringify(restrictions),
      xmlCategoryTree: dlockly.generateXmlTreeRecursively(categories),
      generators: generators,
      blocklyXml: dlockly.getBlocklyXml(req.query.guild),
      exampleXml: dlockly.getExampleXml(),
      guildName: this.bot.guilds.get(req.query.guild).name,
      guildId: this.bot.guilds.get(req.query.guild).id,
      invite: perms.isAdmin(user.user),
    });
  }
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
        if (message.mentions.users.size != 1) {
          message.channel.send({
            embed: {
              "title": "Invalid Usage",
              "description": "You must mention exactly one user",
              "color": 15406156
            }
          });
          return;
        }
        if (!args[0].match(/<@!?[0-9]*>/g)) {
          message.channel.send({
            embed: {
              "title": "Invalid Usage",
              "description": "Expected a user mention as the first argument",
              "color": 15406156
            }
          });
          return;
        }
        if (isNaN(Number(args[1])) || !isFinite(Number(args[1]))) {
          message.channel.send({
            embed: {
              "title": "Invalid Usage",
              "description": "Expected a finite non-zero number as the second argument",
              "color": 15406156
            }
          });
          return;
        }

        if (Number(args[1]) != 0) {
          votes.addVotes(message.mentions.users.first().id, Number(args[1]));
          if (Number(args[1]) > 0) {
            message.channel.send({
              embed: {
                "title": "Success",
                "description": `${message.mentions.users.first()} has received ${Number(args[1])} vote${Number(args[1]) == 1 ? "" : "s"}!`,
                "color": 53380,
                "fields": [{
                  "name": "Total Votes",
                  "value": String(votes.getTotalVotes(message.mentions.users.first().id)),
                  "inline": false
                }]
              }
            });
          } else {
            message.channel.send({
              embed: {
                "title": "Success",
                "description": `${message.mentions.users.first()} has lost ${Number(args[1]) * -1} vote${Number(args[1]) == -1 ? "" : "s"}!`,
                "color": 53380,
                "fields": [{
                  "name": "Total Votes",
                  "value": String(votes.getTotalVotes(message.mentions.users.first().id)),
                  "inline": false
                }]
              }
            });
          }
        } else {
          message.channel.send({
            embed: {
              "title": "Invalid Usage",
              "description": `Expected a finite non-zero number as the second argument`,
              "color": 15406156
            }
          });
        }
      } catch (e) {

      }
  }
})

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
                decache(p);
              }
            });`);
    } catch (e) {
      console.error(e);
    }
  }
}