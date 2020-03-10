const decache = require("decache");
const fs = require("fs");
const path = require("path");

module.exports.isConfigEmpty = function (id) {
  var cfg = getJsConfig(id);
  if (!cfg) cfg = getDeprecatedConfig(id);
  if (!cfg) return true;
  for (var key in cfg) if (cfg.hasOwnProperty(key)) return false;
  return true;
}

function getJsConfig(id) {
  return getConfig(id, "config.js");
}

function getDeprecatedConfig(id) {
  return getConfig(id, "config.json");
}

function getConfig(id, file) {
  if (!fs.existsSync(path.join(__dirname, "/../data"))) {
    fs.mkdirSync(path.join(__dirname + "/../data"));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id))) {
    fs.mkdirSync(path.join(__dirname, "/../data/", id));
  }
  var p = path.join(__dirname, "/../data/", id, "/" + file);
  if (!fs.existsSync(p)) {
    return null;
  }
  var mod = require(p);
  decache(p);
  return mod;
}

module.exports.getXml = function (id) {
  if (!fs.existsSync(path.join(__dirname, "/../data"))) {
    fs.mkdirSync(path.join(__dirname + "/../data"));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id))) {
    fs.mkdirSync(path.join(__dirname, "/../data/", id));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id, "/blockly.xml"))) {
    return '';
  }
  return fs.readFileSync(path.join(__dirname, "/../data/", id, "/blockly.xml"), 'utf-8');
}

module.exports.getExampleXml = function () {
  return fs.readFileSync(path.join(__dirname, "/../config/example.xml"), 'utf-8');
}