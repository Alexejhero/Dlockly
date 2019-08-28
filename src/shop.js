const fs = require('fs');
const read = require('fs-readdir-recursive');
const path = require('path');

module.exports.loadBlocks = function (p) {
  var blocks = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    if (f.startsWith("/") || f.startsWith("\\")) f = f.substring(1);
    if (f.endsWith("/") || f.endsWith("\\")) f.substr(0, f.length - 1);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));

    if (!json.cost) continue;

    blocks.push(json);
  }

  return blocks;
}

module.exports.getPurchasedBlocks = function (id) {
  if (!fs.existsSync(path.join(__dirname, "/../data"))) {
    fs.mkdirSync(path.join(__dirname + "/../data"));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id))) {
    fs.mkdirSync(path.join(__dirname, "/../data/", id));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id, "/shop.json"))) {
    return {};
  }
  return JSON.parse(fs.readFileSync(path.join(__dirname, "/../data/", id, "/shop.json"), 'utf-8'));
}