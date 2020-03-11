const Discord = require("discord.js");

module.exports.wait = function (s) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

module.exports.sendToChannel = function (c, m) {
  if (m instanceof Discord.MessageEmbed) c.send({ embed: m.toJSON() });
  else c.send(m);
}