const Classes = require("../../src/classes");

var category = new Classes.Category(__dirname);
category.name = "Lists";
category.colour = 260;
category.blocks = [
  ...require("./lists_create_with"),
  require("./lists_repeat"),
  require("./lists_length"),
  require("./lists_isEmpty"),
  require("./list_contains"),
  require("./lists_indexOf"),
  require("./lists_getIndex"),
  require("./lists_getSublist"),
  require("./lists_setIndex"),
  require("./lists_split"),
  require("./lists_sort"),
];

module.exports = category;