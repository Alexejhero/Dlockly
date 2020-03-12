const chalk = require("chalk");

const { ArgImage, Block, Category } = require("./classes");

const icons = require("../config/icons.json");

module.exports.initialize = function () {
  var categories = initCategories(require("../blocks"));
  var blocks = initBlocks(categories);

  return {
    categories,
    blocks
  }
}

/** @param {Category[]} categories */
module.exports.generateXmlTree = function (categories) {
  var result = "";
  for (var c of categories) {
    if (c.sep) {
      result += "<sep></sep>";
      continue;
    }
    result += "<category name='" + c.name + "' colour='" + c.colour + "'";
    if (c.custom) result += " custom='" + c.custom + "'";
    result += ">";
    result += this.generateXmlTree(c.subcategories);
    for (var b of c.blocks) {
      result += "<block type='" + b.type + "'>";
      if (b.extra) result += b.extra;
      result += "</block>";
    }
    result += "</category>";
  }
  return result;
}

/**
 * @param {Category[]} categories 
 * @param {Boolean} premium 
 */
function initBlocks(categories) {
  var result = [];
  for (var category of categories) {
    for (var block of category.blocks) {
      initBlock(block, category);
      result.push(block);
    }
  }
  return result;
}

/**
 * @param {Block} block 
 * @param {Category} category
 */
function initBlock(block, category) {
  block.category = category;

  if (block.cost) {
    if (premium) block.icons.unshift("premium_unlocked");
    else {
      block.icons.unshift("premium_locked");
      block.max = -1;
    }
  }

  for (var icon of block.icons.reverse()) {
    block.args0.unshift(new ArgImage("premium", icons[icon]));
    block.message0 = bumpMessageNumbers(block.message0);
  }

  if (block.optionalReturn) {
    if (block.mutator) {
      console.warn(chalk.yellow("Block + " + block.type + " has both a mutator and an optional return! Ignoring optional return"));
    } else {
      block.mutator = require("../blocks/Mutators/optional_return");
    }
  }

  if (block.colour == undefined) block.colour = category.colour;
  if (block.style) block.colour = undefined;
}

/**
 * @param {Category[]} categories 
 * @returns {Category[]}
 */
function initCategories(categories) {
  var result = [];
  for (var category of categories) {
    result.push(category);
    if (category.subcategories) result.push(initCategories(category.subcategories));
  }
  return result;
}

/**
 * @param {string} message 
 */
function bumpMessageNumbers(message) {
  var str = "%0 " + message;
  var nr = str.match(/%\d+/g).length;

  for (var i = nr - 1; i >= 0; i--) {
    str = str.replace("%" + i, "%" + Number.parseInt(i + 1));
  }

  return str;
}