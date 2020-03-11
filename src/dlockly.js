const fs = require("fs");
const path = require("path");
const read = require("fs-readdir-recursive");

const icons = require("../config/icons.json");

module.exports.initialize = function (premium) {
  var categories = initializeCategories(path.join(__dirname, "/../blocks/categories.jsonc"));
  var results = initializeBlocks(path.join(__dirname, "/../blocks/"), categories, premium);
  return {
    ...results,
    categories
  };
}

module.exports.generateXmlTreeRecursively = function (categories) {
  var result = "";
  for (var c of categories) {
    if (c.sep) {
      result += "<sep></sep>";
      continue;
    }
    result += "<category name='" + c.name + "' colour='" + c.color + "'";
    if (c.custom) result += " custom='" + c.custom + "'";
    result += ">";
    //result += this.generateXmlTreeRecursively(c.subcategories);
    for (var b of c.blocks) {
      result += "<block type='" + b.type + "'>";
      if (b.extra) result += b.extra;
      result += "</block>";
    }
    result += "</category>";
  }
  return result;
}

function initializeBlocks(p, categories, premium) {
  var blocks = [];
  var colors = [];
  var generators = [];
  var max = {};
  var mutators = [];
  var reserved = [];
  var restrictions = {};

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    var block = JSON.parse(fs.readFileSync(path.join(p, f)));
    var splits = f.split(/[\/\\]+/g);
    splits.pop();

    if (block.icons) {
      var _icons = block.icons.reverse();
      for (var icon of _icons) {
        if (!block.args0) block.args0 = [];

        block.args0.unshift({
          "type": "field_image",
          "src": icons[icon],
          "width": 15,
          "height": 15,
          "alt": icon,
          "flipRtl": false
        });

        block.message0 = bumpMessageNumbers(block.message0);
      }
    }

    if (!block.deprecated && block.cost) {
      if (!block.args0) block.args0 = [];

      var src;
      if (premium) src = "premium_unlocked";
      else {
        src = "premium_locked";
        max[block.type] = -1;
      }

      block.args0.unshift({
        "type": "field_image",
        "src": icons[src],
        "width": 15,
        "height": 15,
        "alt": src,
        "flipRtl": false
      });

      block.message0 = bumpMessageNumbers(block.message0);
    }

    if (!block.default && block.optionalReturn) {
      block.mutator = block.type + "_optional_return_mutator";

      blocks.push({
        "type": block.type + "_mutator_container",
        "message0": block.message0 ? block.message0.replace(/%\d+/g, "").replace(/ +/g, " ") + " %1 and return output %2" : "return output %1 %2",
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
        "colour": block.colour,
        "helpUrl": ""
      });

      blocks.push({
        "type": block.type + "_mutator_dummy",
        "message0": "Block Editor",
        "args0": [],
        "inputsInline": true,
        "helpUrl": ""
      });
    }

    if (block.reserved) reserved = [
      ...reserved,
      ...block.reserved,
    ];

    if (block.max && !max[block.type]) max[block.type] = block.max;

    if (block.restrictions) restrictions[block.type] = block.restrictions;

    var categoryName = block.category;
    if (!categoryName) {
      var oldCategoryName;
      categoryName = splits.pop();

      while (categoryName) {
        oldCategoryName = categoryName;
        categoryName = splits.pop();
      }

      categoryName = oldCategoryName;
    }
    var category = findCategoryRecursively(categories, categoryName);
    if (!block.hidden && !block.deprecated && category) category.blocks.push(block);

    if (typeof block.color == "undefined" && typeof block.colour == "undefined") block.colour = block.color;
    if (typeof block.colour == "undefined" && category) block.colour = category.color;
    if (typeof block.color != "undefined" || typeof block.colour != "undefined") colors.push({ type: block.type, color: block.color || block.colour });

    if (!block.default && !block.deprecated && (block.generator || block.returnGen)) {
      generators.push({
        type: block.type,
        generator: block.generator,
        returnGen: block.returnGen,
      });
    }

    if (!block.default && block.mutator && !block.optionalReturn) {
      var matches = read(p).filter(_p => path.parse(path.join(p, _p)).base == block.mutator + ".js");
      if (matches.length > 1) throw Error("Found multiple mutator files for mutator type: " + block.mutator);
      if (matches.length < 1) throw Error("Found no matching mutator files for mutator: " + block.mutator);

      var mutator = fs.readFileSync(path.join(p, matches[0]), 'utf-8');
      mutators.push(mutator);
    }

    blocks.push(block);
  }

  return {
    blocks,
    colors,
    generators,
    max,
    mutators,
    reserved,
    restrictions,
  }
}

function initializeCategories(p) {
  var result = [];
  var categories = JSON.parse(fs.readFileSync(p, 'utf-8'));

  for (var category of categories) {
    // TODO: Add support for sub-categories
    result.push({
      ...category,
      blocks: [],
      color: category.colour || category.color,
      colour: category.colour || category.color,
    });
  }

  return result;
}

function findCategoryRecursively(categories, cat) {
  cat = cat.trim();

  for (var c of categories) {
    if (c.name == cat) return c;
  }
}

function bumpMessageNumbers(message) {
  var str = "%0 " + message;
  var nr = str.match(/%\d+/g).length;

  for (var i = nr - 1; i >= 0; i--) {
    str = str.replace("%" + i, "%" + Number.parseInt(i + 1));
  }

  return str;
}