const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Emojis";
category.colour = "#808080";
category.blocks = [
  require("./on_emoji_create"),
  require("./on_emoji_delete"),
  require("./emoji"),
  require("./emoji_name"),
  require("./emoji_url"),
];

module.exports = category;