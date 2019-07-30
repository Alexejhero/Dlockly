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
module.exports.bot = new Discord.Client();
module.exports.dbl = new DBL(process.env.DBL_TOKEN, {
  webhookPort: process.env.PORT,
  webhookAuth: process.env.DBL_WEBHOOK_AUTH,
  webhookServer: web.listen(process.env.PORT),
}, this.bot);

init();

web.all('*', async (req, res) => {
  if (fs.existsSync(path.join(__dirname, "/config/disable"))) {
    res.sendFile(path.join(__dirname, "/www/html/maintenance.html"));
    return;
  }

  var browser = req.useragent.browser;
  if (browser != "Chrome" && browser != "Firefox") {
    res.sendFile(path.join(__dirname, "/www/html/browserunsup.html"));
    return;
  }

  var {
    authUserID,
    authSession
  } = auth.getCookies(req);
  var user = await discord.getUser(this.bot, authUserID);

  if (req.path.endsWith(".js") || req.path.endsWith(".css") || req.path.endsWith(".ico") || req.path.endsWith(".html")) {
    res.sendFile(path.join(__dirname, req.path));
  } else if (fs.existsSync(path.join(__dirname, "/src/requests/", req.path + ".js"))) {
    require('./' + path.join('src/requests/', req.path))({
      authSession,
      authUserID,
      res,
      req,
      user
    });
  } else {
    if (!auth.sessionValid(authUserID, authSession, this.db)) {
      res.render(path.join(__dirname, "/www/html/login.ejs"));
      return;
    }

    if (!user) {
      res.sendFile(path.join(__dirname, "/www/html/unknownuser.html"));
      return;
    }

    if (!discord.getConfigurableGuilds(bot, user).concat(discord.getConfigurableGuilds(bot, user, true)).map(g => g.id).includes(req.query.guild)) {
      res.render("www/html/guildpicker.ejs", {
        user: user,
        adminGuilds: discord.getConfigurableGuilds(bot, user, true).sort(discord.guildSort),
        configurableGuilds: discord.getConfigurableGuilds(bot, user).sort(discord.guildSort),
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
      guildName: bot.guilds.get(req.query.guild).name,
      guildId: bot.guilds.get(req.query.guild).id,
      invite: perms.isAdmin(user.user, bot),
    });
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
                try {
                  if (module.${event}) module.${event}(${parameters.join(",")});
                  decache(p);
                } catch (e) {
                  errors.onerror(guild.id, e);
                }
              }
            });`);
    } catch (e) {
      console.error(e);
    }
  }
}