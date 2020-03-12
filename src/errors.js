const config = require("./config");
const server = require('..');

module.exports.initialize = function () {
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: ', p, 'reason:', reason);
  });

  server.bot.on('error', (e) => {
    console.error(e);
  });

  server.bot.on('warn', (w) => {
    console.warn(w);
  });
}

module.exports.onerror = function (id, err, dontsend) {
  console.error("Guild: ", id, "Error:", err);
  var cfg = config.getJsConfig(id);
  if (!dontsend && cfg && cfg.error) {
    var guild = server.bot.guilds.cache.get(id);
    cfg.error(err, guild);
  }
}