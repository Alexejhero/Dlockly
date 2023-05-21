const fs = require("fs");
const path = require("path");

module.exports.hasPremium = function (guild) {
  if (!fs.existsSync(path.join(__dirname, "/../data/"))) fs.mkdirSync(path.join(__dirname, "/../data/"));
  if (!fs.existsSync(path.join(__dirname, "/../data/", guild))) fs.mkdirSync(path.join(__dirname, "/../data/", guild));
  if (!fs.existsSync(path.join(__dirname, "/../data/", guild, "premium.json"))) return false;

  try {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "/../data/", guild, "premium.json")));
    if (!data || !data.expires) return false;

    var end = new Date(data.expires);
    if (!end) return false;

    if (new Date(Date.now()) < end) return true;
    else return false;
  } catch (e) {
    console.error("Error when attempting to check premium of guild", guild, "\n", e);
    return false;
  }
}