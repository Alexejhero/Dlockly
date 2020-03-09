const decache = require('decache');
const fs = require('fs');
const read = require('fs-readdir-recursive');
const path = require('path');

const icons = require('../config/icons.json');

module.exports.initialize = function (premium) {
  return this.initializeAllBlocks(this.initializeAllCategoriesRecursively(), premium);
}

module.exports.isConfigEmpty = function (id) {
  var mod = getJsConfig(id);
  if (!mod) {
    mod = getDeprecatedConfig(id);
  }
  for (var key in mod) {
    if (mod.hasOwnProperty(key)) return false;
  }
  return true;
}

function getJsConfig(id) {
  if (!fs.existsSync(path.join(__dirname, "/../data"))) {
    fs.mkdirSync(path.join(__dirname + "/../data"));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id))) {
    fs.mkdirSync(path.join(__dirname, "/../data/", id));
  }
  var p = path.join(__dirname, "/../data/", id, "/config.js");
  if (!fs.existsSync(p)) {
    return null;
  }
  var mod = require(p);
  decache(p);
  return mod;
}

function getDeprecatedConfig(id) {
  if (!fs.existsSync(path.join(__dirname, "/../data"))) {
    fs.mkdirSync(path.join(__dirname + "/../data"));
  }
  if (!fs.existsSync(path.join(__dirname, "/../data/", id))) {
    fs.mkdirSync(path.join(__dirname, "/../data/", id));
  }
  var p = path.join(__dirname, "/../data/", id, "/config.json");
  if (!fs.existsSync(p)) {
    return null;
  }
  var mod = require(p);
  decache(p);
  return mod;
}

module.exports.getBlocklyXml = function (id) {
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

module.exports.generateXmlTreeRecursively = function (categories) {
  var result = "";
  for (var c of categories) {
    if (c.name.includes("[sep]")) {
      result += "<sep></sep>";
      continue;
    }
    result += "<category name='" + c.name.replace(/^\d+ /g, "") + "' colour='" + c.color + "'";
    if (c.custom) result += " custom='" + c.custom + "'";
    result += ">";
    result += this.generateXmlTreeRecursively(c.subcategories);
    for (var b of c.blocks) {
      result += "<block type='" + b.type + "'>";
      if (b.extra) result += b.extra;
      result += "</block>";
    }
    result += "</category>"
  }
  return result;
}

module.exports.initializeAllBlocks = function (categories, premium) {
  var defaultBlocks = initializeDefaultBlocks(path.join(__dirname, "/../blocks/default/"), categories);
  var customBlocks = initializeCustomBlocks(path.join(__dirname, "/../blocks/custom/"), categories, premium);
  var hiddenBlocks = initializeHiddenBlocks(path.join(__dirname, "/../blocks/hidden/"));
  var deprecatedBlocks = initializeDeprecatedBlocks(path.join(__dirname, "/../blocks/deprecated"));

  var blocks = customBlocks.blocks.concat(defaultBlocks).concat(deprecatedBlocks.blocks).concat(hiddenBlocks.blocks);
  var max = customBlocks.max;
  var restrictions = {
    ...customBlocks.restrictions,
    ...deprecatedBlocks.restrictions,
    ...hiddenBlocks.restrictions,
  };
  var generators = customBlocks.generators.concat(hiddenBlocks.generators);

  return {
    blocks,
    max,
    restrictions,
    generators,
    categories,
  }
}

function initializeDefaultBlocks(p, categories) {
  var blocks = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    f = trim(f);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));
    var splits = f.split(/[\/\\]+/g);
    splits.pop();

    json.default = true;
    blocks.push(json);

    var desiredCategoryName = splits.pop();
    var desiredCategory = findCategoryRecursively(categories, desiredCategoryName);
    if (desiredCategory) desiredCategory.blocks.push(json);
  }

  return blocks;
}

function initializeCustomBlocks(p, categories, premium) {
  var blocks = [];
  var max = {};
  var restrictions = {};
  var generators = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    f = trim(f);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));
    var splits = f.split(/[\/\\]+/g);
    splits.pop();

    if (json.icons) {
      var _icons = json.icons.reverse();
      for (var icon of _icons) {
        if (!json.block.args0) json.block.args0 = [];

        json.block.args0.unshift({
          "type": "field_image",
          "src": icons[icon],
          "width": 15,
          "height": 15,
          "alt": icon,
          "flipRtl": false
        });

        json.block.message0 = bumpMessageNumbers(json.block.message0);
      }
    }

    if (json.cost) {
      if (!json.block.args0) json.block.args0 = [];

      var src;
      if (premium) src = "premium_unlocked";
      else {
        src = "premium_locked";
        max[json.block.type] = -1;
      }

      json.block.args0.unshift({
        "type": "field_image",
        "src": icons[src],
        "width": 15,
        "height": 15,
        "alt": src,
        "flipRtl": false
      });

      json.block.message0 = bumpMessageNumbers(json.block.message0);
    }

    if (json.optionalReturn) {
      json.block.optionalReturn = json.optionalReturn;
      json.block.mutator = json.block.type + "_optional_return_mutator";

      blocks.push({
        "type": json.block.type + "_mutator_container",
        "message0": json.block.message0.replace(/%\d+/g, "").replace(/ +/g, " ") + " %1 and return output %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_checkbox",
            "name": "val",
            "checked": false
          }
        ],
        "inputsInline": false,
        "colour": json.block.colour,
        "helpUrl": ""
      });

      blocks.push({
        "type": json.block.type + "_mutator_dummy",
        "message0": "Block Editor",
        "args0": [],
        "inputsInline": true,
        "helpUrl": ""
      });
    }

    blocks.push(json.block);

    if (json.max && !max[json.block.type]) max[json.block.type] = json.max;

    if (json.restrictions) restrictions[json.block.type] = json.restrictions;

    var desiredCategoryName = splits.pop();
    if (desiredCategoryName.startsWith("add ")) desiredCategoryName = desiredCategoryName.substring(4);
    var desiredCategory = findCategoryRecursively(categories, desiredCategoryName);
    var obj = {
      type: json.block.type
    };
    if (json.extra) obj.extra = json.extra;
    if (desiredCategory) desiredCategory.blocks.push(obj);

    if (json.generator || json.returnGen) {
      generators.push({
        type: json.block.type,
        generator: json.generator,
        returnGen: json.returnGen,
      });
    }
  }

  return {
    blocks,
    max,
    restrictions,
    generators,
  };
}

function initializeHiddenBlocks(p) {
  var blocks = [];
  var restrictions = {};
  var generators = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    f = trim(f);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));
    var splits = f.split(/[\/\\]+/g);
    splits.pop();

    if (json.icons) {
      var _icons = json.icons.reverse();
      for (var icon of _icons) {
        if (!json.block.args0) json.block.args0 = [];

        json.block.args0.unshift({
          "type": "field_image",
          "src": icons[icon],
          "width": 15,
          "height": 15,
          "alt": icon,
          "flipRtl": false
        });

        json.block.message0 = bumpMessageNumbers(json.block.message0);
      }
    }

    blocks.push(json.block);

    if (json.restrictions) restrictions[json.block.type] = json.restrictions;

    if (json.generator) {
      generators.push({
        type: json.block.type,
        generator: json.generator,
        returnGen: json.returnGen,
      });
    }
  }

  return {
    blocks,
    restrictions,
    generators,
  };
}

function initializeDeprecatedBlocks(p) {
  var blocks = [];
  var restrictions = {};

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    f = trim(f);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));
    var splits = f.split(/[\/\\]+/g);
    splits.pop();

    json.block.deprecated = true;
    blocks.push(json.block);

    restrictions[json.block.type] = [{
      type: "deprecated",
      message: "This block is deprecated and can no longer be used."
    }];
  }

  return {
    blocks,
    restrictions
  };
}

function trim(f) {
  var ff = f;
  if (ff.startsWith("/") || ff.startsWith("\\")) ff = ff.substring(1);
  if (ff.endsWith("/") || ff.endsWith("\\")) ff.substr(0, ff.length - 1);
  return ff;
}

function findCategoryRecursively(categories, cat) {
  cat = cat.replace(/\([0-9]+\)/g, "");
  cat = cat.replace(/\[[^s](.*?)\]/g, "");
  cat = cat.trim();

  for (var c of categories) {
    if (c.name == cat) return c;

    var subcat = findCategoryRecursively(c.subcategories, cat);
    if (subcat) return subcat;
  }
}

module.exports.initializeAllCategoriesRecursively = function () {
  var defaultCategories = initializeCategoriesRecursively(path.join(__dirname, "/../blocks/default/"));
  var customCategories = initializeCategoriesRecursively(path.join(__dirname, "/../blocks/custom/"));

  return defaultCategories.concat(customCategories);
}

function initializeCategoriesRecursively(p) {
  var isDirectory = source => fs.lstatSync(source).isDirectory();
  var dirs = fs.readdirSync(p).map(name => path.join(p, name)).filter(isDirectory);

  var result = [];
  for (var dir of dirs) {
    var name = dir.split(/[\/\\]+/g).pop();

    if (name.startsWith("add")) continue;

    var colorRegex = /\([0-9]+\)/g;
    var colorRegexMatches = colorRegex.exec(name);
    var color = colorRegexMatches && colorRegexMatches[0] ? colorRegexMatches[0].substring(1, colorRegexMatches[0].length - 1) : "0";
    name = name.replace(colorRegex, "");

    var customRegex = /\[[^s](.*?)\]/g;
    var customRegexMatches = customRegex.exec(name);
    var custom = customRegexMatches && customRegexMatches[0] ? customRegexMatches[0].substring(1, customRegexMatches[0].length - 1) : "";
    name = name.replace(customRegex, "");

    name = name.trim();

    result.push({
      name: name,
      color: color,
      custom: custom,
      subcategories: initializeCategoriesRecursively(dir),
      blocks: [],
    });
  }

  return result;
}

function bumpMessageNumbers(message) {
  var str = "%0 " + message;
  var nr = str.match(/%\d+/g).length;

  for (var i = nr - 1; i >= 0; i--) {
    str = str.replace("%" + i, "%" + Number.parseInt(i + 1));
  }

  return str;
}