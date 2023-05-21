const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "_deprecated_";
category.blocks = [
  require("./member_has_permission"),
  require("./run_1"),
  require("./run_2"),
  require("./set_channel_nsfw"),
  require("./str_space"),
];

// TODO: Add deprecated restriction

module.exports = category;